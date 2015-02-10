'use strict';

angular.module('schwanzen')
  .controller('MainCtrl', ['$scope', '$log', '$sce', 'TabService', 'ConfigService', function ($scope, $log, $sce, TabService, ConfigService) {

    // TODO: Make sure this links to the view.
    $scope.maxLength = ConfigService.maxLength;

    // Object that references all of the current tabs.
    $scope.tabs = TabService.tabs;

    //Get the object referencing the Settings Tab
    $scope.comboTab = TabService.comboTab;

    $scope.addTab = function(filename) {

      TabService.build(filename)
        .then(function(tab) {

          tab.tail.on('line', function(line) {

            var trustedLine = $sce.trustAsHtml(line);
            $log.debug('We found a line, and it is ' + trustedLine);

            tab.addLine(trustedLine+'<br/>');
            $scope.comboTab.addLine(trustedLine+'<br/>');

            $scope.$applyAsync();

          });

          tab.tail.on('error', function(err) {

            $log.debug('error: ' + err);

          });

          $scope.tabs[filename] = tab;

          if(TabService.count() > 1) {
            $scope.comboTab.disabled = false;
            $log.debug('No longer disabled.');
          }

          $log.debug('Adding tab Scope' + $scope.tabs[filename].filename);

        });

    };

    $scope.closeTab = function(filename) {

      TabService.closeTab(filename, function() {

        $log.debug($scope.tabs);

        if(TabService.count() < 2) {
          $scope.comboTab.disabled = true;
          $log.debug('Disabled again.');
        }

      });

    };

  }]);
