'use strict';

angular.module('schwanzen')
  .controller('MainCtrl', function ($scope, $log) {

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

    $scope.tabs = [

      /*
      {
        filename:'Dynamic Title 1',
        lines: [
        'Line 1',
        'Line 2'
      ]},
      {
        filename:'Dynamic Title 2',
        lines: [
        'Line 3',
        'Line 4'
      ]}
      */

    ];

    $scope.addTabFile = function(fileObject) {

      $scope.tabs.push(fileObject);

      $scope.$applyAsync();

    };

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

    $scope.closeApp = function() {

      $log.debug('Closing app...');

      if(gui) {
        gui.App.quit();
      }

    };

    var callDialog = function(dialog, callback) {

      dialog.addEventListener('change', function() {

        var result = dialog.value;
        callback(result);

      }, false);

      dialog.click();

    };

    $scope.tailFile = function(fileName) {

      $log.debug('Selected ' + fileName);

      if(Tail) {

        if (!fs.existsSync(fileName)) fs.writeFileSync(fileName, "");

        var tail = new Tail(fileName, "\n", { start: 0 });

        $log.debug('tail:');
        $log.debug(tail);

        var tailFile = {

          filename: fileName,
          tail: tail,
          lines: []

        };

        tail.on("line", function(data) {

          $log.debug(data);
          tailFile.lines.push(data);
          $scope.$applyAsync();

        });

        tail.on("error", function(error) {

          $log.debug('ERROR: ', error);

        });

        tail.watch();

        $log.debug($scope.tabs);

        $log.debug('Pushing tailFile:');
        $log.debug(tailFile);

        $scope.addTabFile(tailFile);
        //$scope.tabs.push(tailFile);

        $log.debug($scope.tabs);

      }

    };

    $scope.chooseFile = function() {

      $log.debug('Choosing file...');

      /*
       var chooser = $(name);
       chooser.change(function(evt) {
       $log.debug($(this).val());
       });

       chooser.trigger('click');
       */

      //chooseFile('#fileDialog');

      var dialog = document.createElement('input');

      dialog.type = 'file';
      dialog.multiple = 'multiple';

      callDialog(dialog, function(fileName) {

        $scope.tailFile(fileName);

      });

    };

  });
