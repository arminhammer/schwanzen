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
    $scope.tailLengthMax = 10;
    //Interval to wait before polling the file again
    $scope.updateInterval = 1000;

    // Object that references all of the current tabs.
    $scope.tabs = TabService.tabs;

    $scope.addTab = function(filename) {

      TabService.build(filename)
        .then(function(tab) {

          $scope.tabs[filename] = tab;
          $log.debug('Adding tab Scope' + $scope.tabs[filename].filename);

          $scope.tabs[filename].tail.on('data', function(data) {
            //$log.debug("got data: ");

            var dataLines = data.toString().match(/[^\n]+(?:\r?\n|$)/g);

            if($scope.tabs[filename].lines.length > 0) {

              var lastLine = $scope.tabs[filename].lines[$scope.tabs[filename].lines.length-1].data;

              //$log.debug(lastLine.charAt(lastLine.length-1));
              if(!lastLine.charAt(lastLine.length-1) == '\n') {

                var buffer = dataLines.shift();

                $scope.tabs[filename].lines[$scope.tabs[filename].lines.length-1].data = lastLine + buffer;

                //$log.debug('no, it is something else');

              }
              else {

                //$log.debug('Is dashN');

              }

              //$log.debug('M' + $scope.tabs[filename].lines[$scope.tabs[filename].lines.length-1].data+ 'M');

            }

            //var dataLines = data.toString().split('\n');

            //$log.debug(dataLines.length);
            //$scope.tabs[filename].lineBuffer = dataLines.pop();
            //$log.debug('buffer: ' + $scope.tabs[filename].lineBuffer);

            /*
             if ($scope.tabs[filename].lines.length > $scope.tailLengthMax) {

             $log.debug('Lines were: ' + $scope.tabs[filename].lines.length);
             $scope.tabs[filename].lines.shift(dataLines.length);
             $log.debug('Lines after: ' + $scope.tabs[filename].lines.length);

             }
             */

            dataLines.forEach(function(line) {

              $scope.tabs[filename].lines.push({number: $scope.tabs[filename].currentLineNumber, data: line});

              $scope.tabs[filename].newLines++;
              $scope.tabs[filename].currentLineNumber++;

            });

            $scope.$applyAsync();

          });

          $scope.tabs[filename].tail.on('eof', function() {
            $log.debug("reached end of file");

            //$log.debug('Writing linebuffer: ' + $scope.tabs[filename].lineBuffer);

            //$scope.tabs[filename].lines.push({number: $scope.tabs[filename].currentLineNumber, data: $scope.tabs[filename].lineBuffer});

            //$scope.tabs[filename].newLines++;
            //$scope.tabs[filename].currentLineNumber++;

            //$scope.tabs[filename].lineBuffer = null;

          });

          $scope.tabs[filename].tail.on('move', function(oldpath, newpath) {
            $log.debug("file moved from: " + oldpath + " to " + newpath);
          });

          $scope.tabs[filename].tail.on('truncate', function(newsize, oldsize) {
            $log.debug("file truncated from: " + oldsize + " to " + newsize);
          });

          $scope.tabs[filename].tail.on('end', function() {
            $log.debug("ended");
          });

          $scope.tabs[filename].tail.on('error', function(err) {
            $log.debug("error: " + err);
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
