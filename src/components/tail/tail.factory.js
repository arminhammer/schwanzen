'use strict';

angular.module('schwanzen')
  .factory('TailFactory', ['$log', 'TailEventService', function($log, TailEventService) {

    var fs;
    var Tail;

    try {

      Tail = require('always-tail');
      fs = require('fs');

    }
    catch(err) {

      $log.debug('Unable to load node dependencies, disabling...');
      $log.debug(err);

    }

    /**
     * Parse the string to see if it contains a date string.  If it does, return the date string.
     * Otherwise return null.
     * @param data
     * @returns {*}
     */
    function parseForDate(data, callback) {

      // The date patterns
      var patterns = [
        /\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \w{3} \d{4}/,
        /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \w{3}/,
        /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3}/,
        /\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}/
      ];

      var count = 0;

      // Loop through the patterns and search for a date string until one is found.
      while(count < patterns.length) {

        var match = patterns[count].exec(data);

        if(match) {

          // Return the date if it can be made into a Date object that is valid
          if(!isNaN(new Date(match).valueOf())) {

            callback(match[0]);
            return;

          }

        }

        count++;

      }

      callback(null);

    }

    var getTail = function(tab, callback) {

      if(Tail && fs) {

        try {

          fs.access(tab.path, fs.R_OK, function (err) {

            if (err) {

              $log.debug('Error opening file: ' + err);
              //fs.writeFileSync(fileName, '');
              return null;

            }

          });

        }
        catch(err) {
          $log.debug('There was an error checking the existence of the file: ' + err);
        }
        //$log.debug('this:');
        //$log.debug(this);

        var tail = new Tail(tab.path, '\n', {start: 0, interval: tab.updateInterval });
        tab.currentLineNumber = 1;

        $log.debug('tail:');
        $log.debug(tail);

        tail.on('line', function (data) {

          //$log.debug(data);

          if (tab.lines.length > tab.tailLengthMax) {

            tab.lines.shift();

          }

          parseForDate(data, function(parsedDate) {

            $log.debug('parsedDate: ' + parsedDate);
            tab.lines.push({number: tab.currentLineNumber, date: parsedDate, data: data});

            tab.newLines++;
            tab.currentLineNumber++;

            TailEventService.broadcast();

          });

          //$log.debug('parsedDate: ' + parsedDate);
          //tab.lines.push({number: tab.currentLineNumber, data: data});

        });

        tail.on('error', function (error) {

          $log.debug('ERROR: ', error);

        });

        //tail.watch();
        //tab.tail = tail;

        if (typeof callback === 'function') {

          callback(tab, tail);

        }

      }

    };


    var TailFactory = function(filename, callback){

      this.init = function () {

        var nameArr = filename.split('/');

        this.filename = nameArr[nameArr.length-1];
        this.lines = [];
        this.newLines = 0;
        this.path = filename;
        this.active = true;
        this.tailLengthMax = 1000;
        this.updateInterval = 1000;
        this.currentLineNumber = 1;

        getTail(this, function(tab, tail) {

          tab.tail = tail;
          $log.debug('Added tail.');

        });

      };

      /*
       this.likeScore = function(){
       return this.likes_received_count - this.likes_count;
       };

       this.commentScore = function(){
       return this.comments_received_count - this.comments_count;
       };
       */

      this.init();

      if (typeof callback === 'function') {

        callback(this);

      }

    };

    return (TailFactory);

  }])
  .service('TailEventService',function($rootScope) {

    this.broadcast = function(callback) {

      $rootScope.$broadcast('line');

      if (typeof callback === 'function') {

        callback();

      }

    };

    this.listen = function(callback) {

      $rootScope.$on('line', callback);

    };

  });
