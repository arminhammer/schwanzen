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
    $scope.tailLengthMax = 1000;
    //Interval to wait before polling the file again
    $scope.updateInterval = 1000;

    // Object that references all of the current tabs.
    $scope.tabs = TabService.tabs;

    $scope.addTab = function(filename) {

      TabService.add(filename, function() {

        $log.debug('Adding tab ' + $scope.tabs[filename]);

        $scope.tabs[filename].tail.on('line', function (data) {

          $log.debug(data);

          if ($scope.tabs[filename].lines.length > $scope.tabs[filename].tailLengthMax) {

            $scope.tabs[filename].lines.shift();

          }

          $scope.tabs[filename].lines.push({number: $scope.tabs[filename].currentLineNumber, data: data});

          $scope.tabs[filename].newLines++;
          $scope.tabs[filename].currentLineNumber++;

          $scope.$apply();

        });

        $scope.tabs[filename].tail.on('error', function (error) {

          $log.debug('ERROR: ', error);

        });

      });

    };

    $scope.closeTab = function(filename) {

      TabService.closeTab(filename, function() {

        $log.debug($scope.tabs);

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
