'use strict';

angular.module('schwanzen')
  .service('TailService', ['$log', '$q', function($log, $q) {

    var fs;
    var Tail;
    var truncateCount = 200000;

    try {

      Tail = require('file-tail');
      fs = require('fs');
      $log.debug('Loaded deps...')

    }
    catch (err) {

      $log.debug('Unable to load node dependencies, disabling...');
      $log.debug(err);

    }

    this.buildTail = function (filename) {

      var deferred = $q.defer();

      if (Tail && fs) {

        try {

          fs.access(filename, fs.R_OK, function (err) {

            if (err) {

              $log.debug('Error opening file: ' + err);
              return null;

            }

          });

        }
        catch (err) {

          $log.debug('There was an error checking the existence of the file: ' + err);

        }

        fs.stat(filename, function(err, stats) {

          if(err) {
            deferred.reject(err);
          }

          var size = stats.size;

          $log.debug('Size of the file is ' + size);

          // If the file is reasonably sized, read the whole thing.  Otherwise, truncate the beginning.
          //var begin = 0;

          //if(size > truncateCount) {

            //begin = size - truncateCount;
            //$log.debug('Truncating file, starting at ' + begin);

          //}

          deferred.resolve(Tail.startTailing(filename));

          //deferred.resolve(Tail.startTailing({

            //fd: filename,
            //ms: 100,
            //mode: 'line',
            //encoding: 'utf8',
            //onErr: function(error){
            //  $log.debug('Error tailing file! ' + error);
           // }

          //}));

          /*
          deferred.resolve(Tail.createReadStream(filename, {
            beginAt: 'end',
            onMove: 'follow',
            detectTruncate: true,
            onTruncate: 'end',
            endOnError: false
          }));
          */

        });
        //$log.debug('this:');
        //$log.debug(this);

      }

      return deferred.promise;

    };

  }]);
