'use strict';

angular.module('schwanzen')
  .service('ConfigService', ['$log', function($log) {

    this.maxLength = 500000;

  }]);
