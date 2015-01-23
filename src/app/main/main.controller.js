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

    $scope.tailLengthMax = 1000;
    $scope.updateInterval = 1000;

    $scope.tabs = {};


     $scope.tabs['Dynamic Title 1'] = {
     filename:'Dynamic Title 1',
     lines: [
     {number: 1, data: 'Line 1'},
     {number: 2, data: 'Line 2'}
     ],
     newLines: 0
     };


     $scope.tabs['Dynamic Title 2'] = {
     filename:'Dynamic Title 2',
     lines: [
     {number: 1, data: 'Line 1'},
     {number: 2, data: 'Line 2'},
     {number: 3, data: 'Line 3'},
     {number: 4, data: 'Line 4'},
     {number: 5, data: 'Line 5'},
     {number: 6, data: 'Line 6'},
     {number: 7, data: 'Line 7'},
     {number: 8, data: 'Line 8'},
     {number: 9, data: 'Line 9'},
     {number: 10, data: 'Line 10'},
     {number: 11, data: 'Line 11'},
     {number: 12, data: 'Line 12'}
     ],
     newLines: 5
     };

    $scope.tabs['Dynamic Title 3'] = {
      filename:'Dynamic Title 3',
      lines: [
        {number: 1, data: 'Line 1'},
        {number: 2, data: 'Line 2'}
      ],
      newLines: 0
    };

    $scope.tabs['Dynamic Title 4'] = {
      filename:'Dynamic Title 4',
      lines: [
        {number: 1, data: 'Line 1'},
        {number: 2, data: 'Line 2'}
      ],
      newLines: 0
    };

    $scope.tabs['Dynamic Title 5'] = {
      filename:'Dynamic Title 5',
      lines: [
        {number: 1, data: 'Line 1'},
        {number: 2, data: 'Line 2'}
      ],
      newLines: 0
    };


    $scope.tabs['Dynamic Title 6'] = {
      filename:'Dynamic Title 6',
      lines: [
        {number: 1, data: 'Line 1'},
        {number: 2, data: 'Line 2'}
      ],
      newLines: 0
    };


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

    $scope.addTab = function(file) {

      $scope.tabs[file.filename] = file;

      $scope.$applyAsync();

    };

    $scope.closeTab = function(file) {

      $log.debug('Closing tab %s', file);

      $log.debug($scope.tabs);

      if($scope.tabs[file].tail) {

        $scope.tabs[file].tail.unwatch();
        $scope.tabs[file].tail.closeCurrent(function() {

          $log.debug('Closed file descripter for %s', file.filename);
          delete $scope.tabs[file];

        });

      }
      else {

        delete $scope.tabs[file];

      }

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

      var start = Date.now();
      $log.debug('start: ' + start);

      if(Tail) {

        fs.accessSync(fileName, fs.F_OK, function(err) {

          if(err) {

            $log.debug('Error opening file: ' + err);
            fs.writeFileSync(fileName, '');

          }

        });

        var tailRef = new Tail(fileName, '\n', { start: 0, interval: $scope.updateInterval });

        $log.debug('tail:');
        $log.debug(tailRef);

        var lineNumber = 1;

        var nameArr = fileName.split('/');
        var shortName = nameArr[nameArr.length-1];

        var tailFile = {

          filename: shortName,
          path: fileName,
          tail: tailRef,
          lines: [],
          newLines: 0,
          active: false

        };

        tailRef.on('line', function(data) {

          $log.debug(data);

          if(tailFile.lines.length > $scope.tailLengthMax) {

            tailFile.lines.shift();

          }

          tailFile.lines.push({number: lineNumber, data: data});
          tailFile.newLines++;
          lineNumber++;

          $scope.$apply();

        });

        tailRef.on('error', function(error) {

          $log.debug('ERROR: ', error);

        });

        $log.debug($scope.tabs);

        $log.debug('Pushing tailFile:');
        $log.debug(tailFile);

        $scope.addTab(tailFile);

        tailRef.watch();

        var end = Date.now();
        $log.debug('end: ' + end + ', elapsed: ' + (end - start));

      }

    };

    $scope.chooseFile = function() {

      $log.debug('Choosing file...');

      var dialog = document.createElement('input');

      dialog.type = 'file';
      dialog.multiple = 'multiple';

      callDialog(dialog, function(fileName) {

        $scope.tailFile(fileName);

      });

    };

  });
