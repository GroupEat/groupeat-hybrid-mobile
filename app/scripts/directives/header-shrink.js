'use strict';
angular.module('groupeat.directives.header-shrink', []).directive('headerShrink', function ($document) {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      var resizeFactor, scrollFactor, blurFactor;
      var header = $document[0].body.querySelector(attr.headerShrink);
      element.bind('scroll', function(e) {
        var scrollTop = e.originalEvent.detail.scrollTop;
        if (scrollTop >= 0) {
          scrollFactor = scrollTop/2;
          header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, +' + scrollFactor + 'px, 0)';
        } else {
          resizeFactor = -scrollTop/100 + 0.99;
          blurFactor = -scrollTop/10;
          header.style[ionic.CSS.TRANSFORM] = 'scale('+resizeFactor+','+resizeFactor+')';
          header.style.webkitFilter = 'blur('+blurFactor+'px)';
        }
      });
    }
  };
});
