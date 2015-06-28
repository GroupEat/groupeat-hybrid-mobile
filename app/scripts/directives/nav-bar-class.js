'use strict';
angular.module('groupeat.directives.nav-bar-class', []).directive('navBarClass', function () {
  return {
    restrict: 'A',
    compile: function (element, attrs) {
      // We need to be able to add a class the cached nav-bar
      // Which provides the background color
      var cachedNavBar = document.querySelector('.nav-bar-block[nav-bar="cached"]');
      var cachedHeaderBar = cachedNavBar.querySelector('.bar-header');
      // And also the active nav-bar
      // which provides the right class for the title
      var activeNavBar = document.querySelector('.nav-bar-block[nav-bar="active"]');
      var activeHeaderBar = activeNavBar.querySelector('.bar-header');
      var barClass = attrs.navBarClass;
      var ogColors = [];
      var colors = [
        'positive',
        'stable',
        'light',
        'royal',
        'dark',
        'assertive',
        'calm',
        'energized'
      ];
      var cleanUp = function () {
        for (var i = 0; i < colors.length; i++) {
          var currentColor = activeHeaderBar.classList.contains('bar-' + colors[i]);
          if (currentColor) {
            ogColors.push('bar-' + colors[i]);
          }
          activeHeaderBar.classList.remove('bar-' + colors[i]);
          cachedHeaderBar.classList.remove('bar-' + colors[i]);
        }
      };
      return function ($scope) {
        $scope.$on('$ionicView.beforeEnter', function () {
          cleanUp();
          cachedHeaderBar.classList.add(barClass);
          activeHeaderBar.classList.add(barClass);
        });
        $scope.$on('$stateChangeStart', function () {
          for (var j = 0; j < ogColors.length; j++) {
            activeHeaderBar.classList.add(ogColors[j]);
            cachedHeaderBar.classList.add(ogColors[j]);
          }
          cachedHeaderBar.classList.remove(barClass);
          activeHeaderBar.classList.remove(barClass);
          ogColors = [];
        });
      };
    }
  };
});