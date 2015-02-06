'use strict';

angular.module('schwanzen')
  .service('TailService', ['$log', '$q', function($log, $q) {

    var fs;
    var Tail;

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

          deferred.resolve(Tail.startTailing(filename));

        });

      }

      return deferred.promise;

    };

  }]);
