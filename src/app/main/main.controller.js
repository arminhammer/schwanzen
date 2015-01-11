'use strict';

angular.module('schwanzen')
  .controller('MainCtrl', function ($scope, $log) {

    $scope.tabs = [
      { title:'Dynamic Title 1', content: [
        'Line 1',
        'Line 2'
      ]},
      { title:'Dynamic Title 2', content: [
        'Line 3',
        'Line 4'
      ]}
    ];

    $scope.status = {
      isopen: false
    };

    $scope.toggled = function(open) {
      $log.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };

  });
