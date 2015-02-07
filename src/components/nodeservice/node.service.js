'use strict';

angular.module('schwanzen')
  .service('NodeService', ['$log', function($log) {

    this.$fs = null;
    this.$Tail = null;

    try {

      this.$Tail = require('file-tail');
      this.$fs = require('fs');
      $log.debug('Loaded deps...');

    }
    catch (err) {

      $log.debug('Unable to load node dependencies, disabling...');
      $log.debug(err);

    }

  }]);
