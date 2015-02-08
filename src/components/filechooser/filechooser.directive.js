"use strict";

angular.module('schwanzen')
  .directive('fileChooser', function() {
    return {
      scope: true,
      replace: true,
      restrict: 'E',
      link: function(scope, element, attrs) {

        element.bind('click', function () {

          var dialog = document.createElement('input');
          dialog.type = 'file';
          //dialog.multiple = 'multiple';
          dialog.addEventListener('change', function() {

            scope.addTab(dialog.value, function() {

              $log.debug('Added ' + dialog.value);
              dialog.parentNode.removeChild(dialog);

            });

          }, false);

          dialog.click();

        });

      },
      template: '<li><a ng-href="#" data-toggle="tab">' +
      '<span class="tabHeaderText">' +
      '<i class="mdi-file-folder"></i></span>' +
      '</a></li>'
    };
  });
