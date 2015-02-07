'use strict';

angular.module('schwanzen')
  .service('TabService', ['$log', '$q', 'TailService', function($log, $q, TailService) {

    function Tab() {

      this.newLines = 0;

      this.active = false;
      this.disabled = true;

      this.addLine = function(line) {

        this.newLines++;
        this.content += line;

        if(this.content.length > 500000) {
          $log.debug('Slicing...');
          var lineIndex = this.content.indexOf('<br/>');
          var slice = this.content.slice(lineIndex+5);
          $log.debug(slice);
          this.content = slice;
        }
        $log.debug(this.content.length);
        $log.debug(this.content.indexOf('<br/>'));

      };

      this.getNewLines = function() {

        //$log.debug('getting new lines');

        if(this.active) {

          this.newLines = 0;
          return null;

        }
        else if(this.newLines === 0) {

          return null;

        }
        else {

          return this.newLines;

        }

      };

    }

    function SettingsTab() {



    }
    SettingsTab.prototype = new Tab();

    function ComboTab() {

      this.content = "";



    }
    ComboTab.prototype = new Tab();

    function FileTab(filename, tail) {

      var newLines = 0;
      var lines = [];
      this.content = '';

      this.filename = filename;

      this.title = filename;

      try {

        var path = require('path');
        this.title = path.basename(filename);

      }
      catch(err) {

        $log.debug('There was an error loading the path var')

      }

      this.active = true;
      this.disabled = false;
      this.tail = tail;
      this.lineBuffer = null;

      this.getLines = function() {

        return lines;

      };

    }
    FileTab.prototype = new Tab();

    this.comboTab = new ComboTab();
    this.tabs = {};

    // Count the number of file tabs open
    this.count = function() {

      return Object.keys(this.tabs).length;

    };

    this.build = function(filename) {

      var deferred = $q.defer();

      $log.debug('Adding tab ' + filename);

      //var nameArr = filename.split('/');

      TailService.buildTail(filename)
        .then(function(tail) {

          $log.debug('Got tail...');
          $log.debug(tail);
          //tail.go();

          var newTab = new FileTab(filename, tail);

          deferred.resolve(newTab);

        });

      return deferred.promise;

    };

    this.closeTab = function(filename, callback) {

      $log.debug('Closing ' + filename);

      if(this.tabs[filename]) {

        if(this.tabs[filename].tail) {

          delete this.tabs[filename];

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
