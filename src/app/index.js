'use strict';

angular.module('schwanzen', [
  'ngAnimate',
  'ngCookies',
  'ngTouch',
  'ngSanitize',
  'ngResource',
  'ui.router',
  'ui.bootstrap',
  'ui.utils'
])
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    '$logProvider',
    function ($stateProvider, $urlRouterProvider, $logProvider) {

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'app/main/main.html',
          controller: 'MainCtrl'
        });

      $urlRouterProvider.otherwise('/');

      $logProvider.debugEnabled(true);


    }]);
