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

    $scope.addTab = function(filename) {

      TabService.build(filename)
        .then(function(tab) {

          tab.tail.on('data', function(data) {
            $log.debug("got data: ");

            $log.debug(data.toString());
            var dataLines = data.toString().match(/[^\n]+(?:\r?\n|$)/g);
            $log.debug(dataLines);

            if(dataLines.length > 1 && tab.lines.length > 0) {
            //if(tab.lines.length > 0) {

              var lastLine = tab.lines[tab.lines.length-1].data;

              //$log.debug(lastLine.charAt(lastLine.length-1));
              if(lastLine.charAt(lastLine.length-1) !== '\n') {

                var buffer = dataLines.shift();

                tab.lines[tab.lines.length-1].data = lastLine + buffer;

                //$log.debug('no, it is something else');

              }
              else {

                //$log.debug('Is dashN');

              }

              //$log.debug('M' + tab.lines[tab.lines.length-1].data+ 'M');

            }

            //var dataLines = data.toString().split('\n');

            //$log.debug(dataLines.length);
            //tab.lineBuffer = dataLines.pop();
            //$log.debug('buffer: ' + tab.lineBuffer);

            /*
             if (tab.lines.length > $scope.tailLengthMax) {

             $log.debug('Lines were: ' + tab.lines.length);
             tab.lines.shift(dataLines.length);
             $log.debug('Lines after: ' + tab.lines.length);

             }
             */

            for(var ix = 0; ix < dataLines.length; ix++) {

              tab.lines.push({ number: tab.currentLineNumber, data: dataLines[ix] });

              tab.newLines++;
              tab.currentLineNumber++;

              //if (tab.lines.length > $scope.tailLengthMax) {

                //$log.debug('Truncating file...B' + tab.lines.length);
                //tab.lines.shift();
                //$log.debug('Truncating file...A' + tab.lines.length);

              //}

            }

            $scope.$applyAsync();

          });

          tab.tail.on('eof', function() {
            $log.debug("reached end of file");

            //$scope.$applyAsync();

            //$log.debug('Writing linebuffer: ' + tab.lineBuffer);

            //tab.lines.push({number: tab.currentLineNumber, data: tab.lineBuffer});

            //tab.newLines++;
            //tab.currentLineNumber++;

            //tab.lineBuffer = null;

          });

          tab.tail.on('move', function(oldpath, newpath) {

            $log.debug("file moved from: " + oldpath + " to " + newpath);

          });

          tab.tail.on('truncate', function(newsize, oldsize) {

            $log.debug("file truncated from: " + oldsize + " to " + newsize);

          });

          tab.tail.on('end', function() {

            $log.debug("ended");

          });

          tab.tail.on('error', function(err) {

            $log.debug("error: " + err);

          });

          $scope.tabs[filename] = tab;

          $scope.$watch($scope.tabs[filename].lines);

          $log.debug('Adding tab Scope' + $scope.tabs[filename].filename);

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
