'use strict';

angular.module('schwanzen')
  .controller('MainCtrl', ['$scope', '$log', 'TailFactory', function ($scope, $log, TailFactory) {

    var gui;
    var Tail;
    var fs;

    // Load node dependencies.  In a try-catch block so that it doesn't break when testing in the browser.
    try {

      gui = require('nw.gui');
      Tail = require('always-tail');
      fs = require('fs');

    }
    catch(err) {

      $log.debug('Unable to load node dependencies, disabling...');

    }

    // How many lines to keep in a tail file before removing them.
    $scope.tailLengthMax = 1000;
    //Interval to wait before polling the file again
    $scope.updateInterval = 1000;

    // Object that references all of the current tabs.
    $scope.tabs = {};

    $scope.getNewLines = function(tab) {

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

    };

    $scope.addTab = function(filename, callback) {

      $log.debug('Adding tab ' + filename);

      $scope.tabs[filename] = new TailFactory(filename, function() {

        $scope.$applyAsync();

        if (typeof callback === 'function') {

          callback();

        }

      });

    };

    $scope.addTab('All', function() {
      $log.debug('Created All tab.');
    });

    $scope.addTab('Tab1', function() {
      $log.debug('Created Tab1 tab.');
    });


    $scope.closeTab = function(filename, callback) {

      if($scope.tabs[filename].tail) {

        $scope.tabs[filename].tail.unwatch();
        $scope.tabs[filename].tail.closeCurrent(function() {

          delete $scope.tabs[filename];

        });

      }
      else {

        delete $scope.tabs[filename];

      }

      if (typeof callback === 'function') {

        callback();

      }

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
