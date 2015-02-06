'use strict';

angular.module('schwanzen')
  .controller('MainCtrl', ['$scope', '$log', 'TabService', function ($scope, $log, TabService) {

    var gui;

    // Load node dependencies.  In a try-catch block so that it doesn't break when testing in the browser.
    try {

      gui = require('nw.gui');

    }
    catch(err) {

      $log.debug('Unable to load node dependencies, disabling...');
      $log.debug(err);

    }

    // How many lines to keep in a tail file before removing them.
    $scope.tailLengthMax = 2000;
    //Interval to wait before polling the file again
    $scope.updateInterval = 1000;

    // Object that references all of the current tabs.
    $scope.tabs = TabService.tabs;

    //Get the object referencing the Settings Tab
    $scope.comboTab = TabService.comboTab;

    $scope.addTab = function(filename) {

      TabService.build(filename)
        .then(function(tab) {

          tab.tail.on('line', function(line) {

            $log.debug('We found a line, and it is ' + line);

            tab.addLine(line+'<br/>');
            $scope.comboTab.addLine(line+'<br/>');

            $scope.$applyAsync();

          });

          tab.tail.on('error', function(err) {

            $log.debug("error: " + err);

          });

          $scope.tabs[filename] = tab;

          //$scope.$watch($scope.tabs[filename].lines);

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

    var callDialog = function(dialog, callback) {

      dialog.addEventListener('change', function() {

        var result = dialog.value;

        if (typeof callback === 'function') {

          callback(result);

        }

      }, false);

      dialog.click();

    };

    $scope.chooseFile = function() {

      $log.debug('Choosing file...');

      var dialog = document.createElement('input');

      dialog.type = 'file';
      dialog.multiple = 'multiple';

      callDialog(dialog, function(fileName) {

        $scope.addTab(fileName, function() {

          $log.debug('Added ' + fileName);

        });

      });

    };

  }]);
