'use strict';

angular.module('schwanzen')
  .controller('MainCtrl', ['$scope', '$log', 'TailFactory', 'TailEventService', function ($scope, $log, TailFactory, TailEventService) {

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
    $scope.tailLengthMax = 1000;
    //Interval to wait before polling the file again
    $scope.updateInterval = 1000;

    // Object that references all of the current tabs.
    $scope.tabs = {};

    $scope.getNewLines = function(tab) {

      if(tab) {

        if(tab.active) {

          tab.newLines = 0;
          return null;

        }
        else if(tab.newLines === 0) {

          return null;

        }
        else {

          return tab.newLines;

        }

      }

    };

    $scope.addTab = function(filename, callback) {

      $log.debug('Adding tab ' + filename);

      $scope.tabs[filename] = new TailFactory(filename);

      //$log.debug('newLines: ' + newTab.newLines);

      //$scope.$watch(newTab.newLines);
      //$scope.$watch(newTab.lines);

      //$scope.$applyAsync();

      if (typeof callback === 'function') {

        callback();

      }

      //$scope.$watch($scope.tabs[filename]);
      //$scope.$watch($scope.tabs[filename].lines);

    };

    /*
     $scope.addTab('All', function() {
     $log.debug('Created All tab.');
     });

     $scope.addTab('Tab1', function() {
     $log.debug('Created Tab1 tab.');
     });
     */

    $scope.closeTab = function(pathName, callback) {

      $log.debug($scope.tabs);

      if($scope.tabs[pathName]) {

        if($scope.tabs[pathName].tail) {

          $scope.tabs[pathName].tail.unwatch();
          $scope.tabs[pathName].tail.closeCurrent(function() {

            $scope.tabs[pathName] = null;

          });

        }
        else {

          $scope.tabs[pathName] = null;

        }

      }

      if (typeof callback === 'function') {

        callback();

      }

    };

    TailEventService.listen(function() {

      //$log.debug('Updating view!');
      $scope.$apply();

    });

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
