'use strict';

angular.module('schwanzen')
  .factory('TailFactory', ['$log', function($log) {

    var fs;
    var Tail;

    try {

      Tail = require('always-tail');
      fs = require('fs');

    }
    catch(err) {

      $log.debug('Unable to load node dependencies, disabling...');

    }

    var TailFactory = function(filename, callback){

      this.init = function () {

        var nameArr = filename.split('/');
        var shortName = nameArr[nameArr.length-1];

        this.filename = shortName;
        this.lines = [];
        this.newLines = 0;
        this.path = filename;
        this.active = true;
        this.tailLengthMax = 1000;
        this.updateInterval = 1000;
        this.currentLineNumber = 1;

        if(Tail && fs) {

          fs.accessSync(filename, fs.R_OK, function (err) {

            if (err) {

              $log.debug('Error opening file: ' + err);
              //fs.writeFileSync(fileName, '');

            }

          });

          this.tail = new Tail(filename, '\n', { start: 0, interval: this.updateInterval });
          this.currentLineNumber = 1;

          $log.debug('tail:');
          $log.debug(this.tail);

          this.tail.on('line', function(data) {

            $log.debug(data);

            if(this.lines.length > this.tailLengthMax) {

              this.lines.shift();

            }

            this.lines.push({number: this.currentLineNumber, data: data});
            this.newLines++;
            this.currentLineNumber++;

            //$scope.$apply();

          });

          this.tail.on('error', function(error) {

            $log.debug('ERROR: ', error);

          });

          //$scope.addTab(tailFile);

          this.tail.watch();

        }

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

  }]);
