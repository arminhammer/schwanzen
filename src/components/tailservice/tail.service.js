'use strict';

angular.module('schwanzen')
  .service('TailService', ['$log', '$q', function($log, $q) {

    var fs;
    var Tail;
    var truncateCount = 200000;

    try {

      Tail = require('tail-stream');
      fs = require('fs');

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
          var begin = 0;

          if(size > truncateCount) {

            begin = size - truncateCount;
            $log.debug('Truncating file, starting at ' + begin);

          }

          deferred.resolve(Tail.createReadStream(filename, {
            beginAt: begin,
            onMove: 'follow',
            detectTruncate: true,
            onTruncate: 'end',
            endOnError: false
          }));

        });
        //$log.debug('this:');
        //$log.debug(this);

      }

      return deferred.promise;

    };

  }]);
