'use strict';

angular.module('groupeat.services.scroller', [
  'ionic'
])

.factory('Scroller', function (_, $document, $ionicScrollDelegate) {

  /**
    * @ngdoc function
    * @name Scroller#scrollTo
    * @methodOf Scroller
    *
    * @description
    * Scrolls to an element, taking into account the header bar
    *
    * @param {String} elementId - The id of the element to which we want to scroll
    */
  var scrollTo = function (handle, elementId) {
    var delegateHandle = $ionicScrollDelegate.$getByHandle(handle);
    var delegateInstance = _.first(delegateHandle._instances, function(instance) {
      return instance.$$delegateHandle === handle;
    });
    delegateHandle.resize()
    .then(function() {
      var navBarHeight = document.getElementsByTagName('ion-header-bar')[0].clientHeight;
      var elm = $document[0].getElementById(elementId);

      // Code inspired by $ionicScrollDelegate.anchorScroll
      var curElm = elm;
      var scrollLeft = 0, scrollTop = 0;
      do {
        if (curElm !== null) {
          scrollLeft += curElm.offsetLeft;
        }
        if (curElm !== null) {
          scrollTop += curElm.offsetTop;
        }
        curElm = curElm.offsetParent;
      } while (curElm.attributes !== delegateInstance.element.attributes && curElm.offsetParent);
      delegateInstance.scrollView.scrollTo(scrollLeft, scrollTop - navBarHeight, true);
    });
  };

  return {
    scrollTo: scrollTo
  };
});
