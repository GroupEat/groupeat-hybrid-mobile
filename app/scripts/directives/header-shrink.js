'use strict';
angular.module('groupeat.directives.header-shrink', []).directive('headerShrink', function ($document, $timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      var amt, backgroundAmt, resizeFactor, scrollFactor, blurFactor, opacityFactor, navbar;
      var header = $document[0].body.querySelector(attr.headerShrink);
      var content = $document[0].body.querySelector(attr.headerShrink + '-content');
      $timeout(function () {
        navbar = $document[0].body.querySelector('.bar.bar-header');
        console.log(navbar);
      });
      element.bind('scroll', function(e) {
        var scrollTop = e.originalEvent.detail.scrollTop;
        if (scrollTop >= 0) {
          scrollFactor = scrollTop/2;
          opacityFactor = scrollTop/150;
          amt = Math.min(44, scrollTop / 6);
          backgroundAmt = amt / 44;
          header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, +' + scrollFactor + 'px, 0)';
          navbar.style.backgroundColor = 'rgba(48,54,76,' + backgroundAmt + ')';
          content.style.opacity = 1 - opacityFactor;
        } else {
          resizeFactor = -scrollTop/100 + 0.99;
          blurFactor = -scrollTop/10;
          header.style[ionic.CSS.TRANSFORM] = 'scale('+resizeFactor+','+resizeFactor+')';
          navbar.style.backgroundColor = 'rgba(48,54,76,0)';
          content.style.opacity = 1 - blurFactor/6;
          header.style.webkitFilter = 'blur('+blurFactor+'px)';
        }
      });
    }
  };
});
