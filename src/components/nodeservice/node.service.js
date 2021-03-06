'use strict';

angular.module('schwanzen')
  .service('NodeService', ['$log', function($log) {

    this.$fs = null;
    this.$Tail = null;

    try {

      this.$Tail = require('file-tail');
      $log.debug('Loaded deps...');

    }
    catch (err) {

      $log.error('Unable to load node dependencies, disabling...');
      $log.error(err);

    }

  }]);
