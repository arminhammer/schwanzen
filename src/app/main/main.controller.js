'use strict';

angular.module('schwanzen')
  .controller('MainCtrl', function ($scope, $log) {

    var gui;

    try {

      var gui = require('nw.gui');

    }
    catch(err) {

      $log.debug('Unable to enable gui, disabling...');
      $log.debug(err);

    }

    $scope.tabs = [
      { title:'Dynamic Title 1', content: [
        'Line 1',
        'Line 2'
      ]},
      { title:'Dynamic Title 2', content: [
        'Line 3',
        'Line 4'
      ]}
    ];

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

        $log.debug('Selected ' + fileName);

      });

    };

  });
