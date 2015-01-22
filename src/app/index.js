'use strict';

angular.module('schwanzen', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ui.bootstrap', 'mj.scrollingTabs'])
  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise('/');
  })
  .run(['$anchorScroll', function($anchorScroll) {
    $anchorScroll.yOffset = 100;   // always scroll by 50 extra pixels
  }])
;
