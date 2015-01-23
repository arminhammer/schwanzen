'use strict';

angular.module('schwanzen')
  .factory('TailFactory', [function() {

    var TailFactory = function(file){

      this.val = '';

      this.init = function () {

        this.val = "New Value";

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
