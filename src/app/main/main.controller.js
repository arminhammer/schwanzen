'use strict';

angular.module('schwanzen')
  .controller('MainCtrl', function ($scope, $log, $location, $anchorScroll) {

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
        'Line 1',
        'Line 2'
      ],
      newLines: 0
    };


    $scope.tabs['Dynamic Title 2'] = {
      filename:'Dynamic Title 2',
      lines: [
        'Line 1',
        'Line 2',
        'Line 3',
        'Line 3',
        'Line 4',
        'Line 5',
        'Line 6',
        'Line 7',
        'Line 8',
        'Line 9',
        'Line 10',
        'Line 11'
      ],
      newLines: 5
    };

    $scope.getNewLines = function(tab) {
      if(tab.active) {

        tab.newLines = 0;
        return null;

      }
      else if(tab.newLines == 0) {

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

    $scope.scrollToBottom = function(tag) {

      $log.debug('Scrolling to %s', tag);

      //$timeout
      $location.hash(tag);
      //$log.debug(hash);
      $anchorScroll();

    };

    $scope.tailFile = function(fileName) {

      $log.debug('Selected ' + fileName);

      if(Tail) {

        if (!fs.existsSync(fileName)) {

          fs.writeFileSync(fileName, '');

        }

        var tail = new Tail(fileName, '\n', { start: 0, interval: $scope.updateInterval });

        $log.debug('tail:');
        $log.debug(tail);

        var tailFile = {

          filename: fileName,
          tail: tail,
          lines: [],
          newLines: 0

        };

        tail.on('line', function(data) {

          $log.debug(data);

          if(tailFile.lines.length > $scope.tailLengthMax) {
            tailFile.lines.shift();
          }
          tailFile.lines.push(data);
          tailFile.newLines++;
          $scope.scrollToBottom('tabFooter');
          $scope.$apply();

        });

        tail.on('error', function(error) {

          $log.debug('ERROR: ', error);

        });

        tail.watch();

        $log.debug($scope.tabs);

        $log.debug('Pushing tailFile:');
        $log.debug(tailFile);

        $scope.addTab(tailFile);
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
