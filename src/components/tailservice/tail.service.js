'use strict';

angular.module('schwanzen')
  .service('TailService', ['$log', '$q', 'NodeService', function($log, $q, NodeService) {

    this.buildTail = function (filename) {

      var deferred = $q.defer();

      try {

        deferred.resolve(NodeService.$Tail.startTailing({
          fd: filename,
          ms: 500,
          interval: 500
        }));

      }

      catch (err) {

        $log.error('There was an error checking the existence of the file: ' + err);
        deferred.reject(err);

      }

      return deferred.promise;

    };

  }]);
