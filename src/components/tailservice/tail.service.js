'use strict';

angular.module('schwanzen')
  .service('TailService', ['$log', '$q', 'NodeService', function($log, $q, NodeService) {

    this.buildTail = function (filename) {

      var deferred = $q.defer();

      if (NodeService.$Tail && NodeService.$fs) {

        try {

          NodeService.$fs.access(filename, NodeService.$fs.R_OK, function (err) {

            if (err) {

              $log.debug('Error opening file: ' + err);
              return null;

            }

          });

        }
        catch (err) {

          $log.debug('There was an error checking the existence of the file: ' + err);

        }

        NodeService.$fs.stat(filename, function(err, stats) {

          if(err) {
            deferred.reject(err);
          }

          var size = stats.size;

          $log.debug('Size of the file is ' + size);

          deferred.resolve(NodeService.$Tail.startTailing(filename));

        });

      }

      return deferred.promise;

    };

  }]);
