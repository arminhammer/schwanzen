'use strict';

angular.module('schwanzen')
  .service('TabService', ['$log', 'TailService', function($log, TailService) {

    this.tabs = {};

    this.add = function(filename, callback) {

      $log.debug('Adding tab ' + filename);

      var nameArr = filename.split('/');

      var newTab = {

        filename: filename,
        shortName : nameArr[nameArr.length-1],
        lines : [],
        newLines : 0,
        active : true,
        tailLengthMax : 1000,
        updateInterval : 1000,
        currentLineNumber : 1,
        tail : TailService.buildTail(filename),
        lineBuffer : null

      };

      newTab.getNewLines = function() {

        if(newTab.active) {

          newTab.newLines = 0;
          return null;

        }
        else if(newTab.newLines === 0) {

          return null;

        }
        else {

          return newTab.newLines;

        }

      };

      this.tabs[filename] = newTab;

      if (typeof callback === 'function') {

        callback();

      }

    };

    this.closeTab = function(filename, callback) {

      $log.debug('Closing ' + filename);

      if(this.tabs[filename]) {

        if(this.tabs[filename].tail) {

          this.tabs[filename].tail.unwatch();

          delete this.tabs[filename];

          //this.tabs[filename].tail.closeCurrent(function() {
          //});

        }
        else {

          delete this.tabs[filename];

        }

      }

      if (typeof callback === 'function') {

        callback();

      }

    };

  }]);
