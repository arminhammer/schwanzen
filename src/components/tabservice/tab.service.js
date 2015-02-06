'use strict';

angular.module('schwanzen')
  .service('TabService', ['$log', '$q', 'TailService', function($log, $q, TailService) {

    function Tab(filename, tail) {

      var newLines = 0;
      var lines = [];
      this.content = '';

      this.filename = filename;

      this.title = filename;

      try {

        var path = require('path');
        this.title = path.basename(filename);

      }
      catch(err) {

        $log.debug('There was an error loading the path var')

      }

      this.active = true;
      this.tail = tail;
      this.lineBuffer = null;

      this.getLines = function() {

        return lines;

      };

      this.getNewLines = function() {

        //$log.debug('getting new lines');

        if(this.active) {

          newLines = 0;
          return null;

        }
        else if(newLines === 0) {

          return null;

        }
        else {

          return newLines;

        }

      };

      this.addLine = function(line) {

        newLines++;
        //lines.push(line);
        this.content += line;

      };

      this.addLines = function(data) {

        var deferred = $q.defer();

        $log.debug("got data: ");

        $log.debug(data.toString());
        var dataLines = data.toString().match(/[^\n]+(?:\r?\n|$)/g);
        $log.debug(dataLines);

        if(dataLines.length > 1 && lines.length > 0) {

          var lastLine = lines[lines.length-1].data;

          //$log.debug(lastLine.charAt(lastLine.length-1));
          if(lastLine.charAt(lastLine.length-1) !== '\n') {

            var buffer = dataLines.shift();

            lines[lines.length-1].data = lastLine + buffer;

            //$log.debug('no, it is something else');

          }
          else {

            //$log.debug('Is dashN');

          }

          //$log.debug('M' + tab.lines[tab.lines.length-1].data+ 'M');

        }

        for(var ix = 0; ix < dataLines.length; ix++) {

          $log.debug('line ' + dataLines[ix]);
          addLine({  data: dataLines[ix] });

        }

        deferred.resolve();

        return deferred.promise;

      }

    }

    this.tabs = {};

    this.build = function(filename) {

      var deferred = $q.defer();

      $log.debug('Adding tab ' + filename);

      //var nameArr = filename.split('/');

      TailService.buildTail(filename)
        .then(function(tail) {

          $log.debug('Got tail...');
          $log.debug(tail);
          //tail.go();

          var newTab = new Tab(filename, tail);

          /*
          var newTab = {

            filename: filename,
            shortName : nameArr[nameArr.length-1],
            lines : [],
            newLines : 0,
            active : true,
            tailLengthMax : 1000,
            updateInterval : 1000,
            currentLineNumber : 1,
            tail : tail,
            lineBuffer : null

          };

          newTab.getNewLines = function() {

            if(newTab.active) {

              newTab.newLines = 0;
              return null;

            }
            else if(newTab.newLines === 0) {

              return null;

            }
            else {

              return newTab.newLines;

            }

          };
           */

          deferred.resolve(newTab);

          //this.tabs[filename] = newTab;

          //if (typeof callback === 'function') {

          //callback();

          //}

        });

      return deferred.promise;

    };

    this.closeTab = function(filename, callback) {

      $log.debug('Closing ' + filename);

      if(this.tabs[filename]) {

        if(this.tabs[filename].tail) {

          //this.tabs[filename].tail.unwatch();

          delete this.tabs[filename];

          //this.tabs[filename].tail.closeCurrent(function() {
          //});

        }
        else {

          delete this.tabs[filename];

        }

      }

      if (typeof callback === 'function') {

        callback();

      }

    };

  }]);
