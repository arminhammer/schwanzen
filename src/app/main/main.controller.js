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

    var testFact = new TailFactory('file');
    //var testName = testFact.hello('Armin');
    $log.debug(testFact.val);

    $scope.tailLengthMax = 1000;
    $scope.updateInterval = 1000;

    $scope.tabs = {};

    $scope.tabs['All'] = new TailFactory({
      filename: 'All',
      lines: [],
      newLines: 0,
      active: true
    });

    $scope.tabs['Tab1'] = new TailFactory({
      filename: 'Tab1',
      lines: [
        {number: 1, data: 'Line 1'},
        {number: 2, data: 'Line 2'}
      ],
      newLines: 0
    });

    $scope.tabs['Tab2'] = new TailFactory({
      filename: 'Tab2',
      lines: [
        {number: 1, data: 'Line 3'},
        {number: 2, data: 'Line 4'}
      ],
      newLines: 5
    });

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

      $scope.tabs[file.filename] = new TailFactory(file);
      $scope.$applyAsync();

    };

    $scope.closeTab = function(file) {

      if($scope.tabs[file].tail) {

        $scope.tabs[file].tail.unwatch();
        $scope.tabs[file].tail.closeCurrent(function() {

          delete $scope.tabs[file];

        });

      }
      else {

        delete $scope.tabs[file];

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

  }]);
