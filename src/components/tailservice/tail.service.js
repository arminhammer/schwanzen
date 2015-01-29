'use strict';

angular.module('schwanzen')
  .service('TailService', ['$log', function($log) {

    var fs;
    var Tail;

    try {

      Tail = require('always-tail');
      fs = require('fs');

    }
    catch (err) {

      $log.debug('Unable to load node dependencies, disabling...');
      $log.debug(err);

    }

    this.buildTail = function (filename) {

      if (Tail && fs) {

        try {

          fs.access(filename, fs.R_OK, function (err) {

            if (err) {

              $log.debug('Error opening file: ' + err);
              return null;

            }

          });

        }
        catch (err) {
          $log.debug('There was an error checking the existence of the file: ' + err);
        }
        //$log.debug('this:');
        //$log.debug(this);

        return new Tail(filename, '\n', { interval: 1000 });

      }

    };

  }]);
