'use strict';

angular.module('schwanzen')
  .service('TabService', ['$log', '$q', 'TailService', function($log, $q, TailService) {

    this.tabs = {};

    this.build = function(filename) {

      var deferred = $q.defer();

      $log.debug('Adding tab ' + filename);

      var nameArr = filename.split('/');

      TailService.buildTail(filename)
        .then(function(tail) {

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
