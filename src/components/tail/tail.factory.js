'use strict';

angular.module('schwanzen')
  .factory('TailFactory', [function() {

    var TailFactory = function(file){

      this.filename;
      this.lines;
      this.newLines;
      this.path;
      this.tail;
      this.active;

      this.init = function () {

        this.filename = file.filename;
        this.lines = file.lines;
        this.newLines = file.newLines;
        this.path = file.path;
        this.tail = file.tail;
        this.active = file.active;

      };

      /*
      this.likeScore = function(){
        return this.likes_received_count - this.likes_count;
      };

      this.commentScore = function(){
        return this.comments_received_count - this.comments_count;
      };
      */

      this.init();
    };

    return (TailFactory);

  }]);
