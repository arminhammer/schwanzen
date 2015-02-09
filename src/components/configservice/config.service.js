'use strict';

angular.module('schwanzen')
  .service('ConfigService', ['$log', function($log) {

    $log.debug('Config Service Starting...');
    this.maxLength = 100000;

  }]);
