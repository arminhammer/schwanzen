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

          tab.lines.push({number: tab.currentLineNumber, data: data});
          tab.newLines++;
          tab.currentLineNumber++;

          TailEventService.broadcast();
          //$scope.$apply();

        });

        tail.on('error', function (error) {

          $log.debug('ERROR: ', error);

        });

        //$scope.addTab(tailFile);

        tail.watch();

        tab.tail = tail;

        if (typeof callback === 'function') {

          callback();

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

        getTail(this, function() {

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

    this.broadcast = function() {

      $rootScope.$broadcast('line');

    };

    this.listen = function(callback) {

      $rootScope.$on('line',callback);

    };

  });
