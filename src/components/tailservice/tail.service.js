'use strict';

angular.module('schwanzen')
  .service('TailService', ['$log', '$q', 'NodeService', function($log, $q, NodeService) {

    this.buildTail = function (filename) {

      var deferred = $q.defer();

      try {

        deferred.resolve(NodeService.$Tail.startTailing(filename));

      }

      catch (err) {

        $log.error('There was an error checking the existence of the file: ' + err);
        deferred.reject(err);

      }

      return deferred.promise;

    };

  }]);
