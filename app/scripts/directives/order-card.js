'use strict';
angular.module('groupeat.directives.order-card', []).directive('orderCard', function () {
    return {
      restrict: 'EA',
      link: function (scope, elem) {
        var top = elem[0].querySelector('.top');
        console.log($(document).height());
        top.style.height = $(document).height() - 380 + 'px';
      }
    };
  });
