'use strict';
angular.module('slick', []).directive('slick', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'AEC',
      scope: {
        initOnload: '@',
        data: '=',
        currentIndex: '=',
        accessibility: '@',
        adaptiveHeight: '@',
        arrows: '@',
        asNavFor: '@',
        appendArrows: '@',
        appendDots: '@',
        autoplay: '@',
        autoplaySpeed: '@',
        centerMode: '@',
        centerPadding: '@',
        cssEase: '@',
        customPaging: '&',
        dots: '@',
        draggable: '@',
        easing: '@',
        fade: '@',
        focusOnSelect: '@',
        infinite: '@',
        initialSlide: '@',
        lazyLoad: '@',
        onBeforeChange: '=',
        onAfterChange: '=',
        onInit: '=',
        onReInit: '=',
        onSetPosition: '=',
        pauseOnHover: '@',
        pauseOnDotsHover: '@',
        responsive: '=',
        rtl: '@',
        slide: '@',
        slidesToShow: '@',
        slidesToScroll: '@',
        speed: '@',
        swipe: '@',
        swipeToSlide: '@',
        touchMove: '@',
        touchThreshold: '@',
        useCSS: '@',
        variableWidth: '@',
        vertical: '@',
        prevArrow: '@',
        nextArrow: '@'
      },
      link: function (scope, element, attrs) {
        var destroySlick, initializeSlick, isInitialized;
        destroySlick = function () {
          return $timeout(function () {
            var slider;
            slider = $(element);
            slider.slick('unslick');
            slider.find('.slick-list').remove();
            return slider;
          });
        };
        initializeSlick = function () {
          return $timeout(function () {
            var currentIndex, customPaging, slider;
            slider = $(element);
            if (scope.currentIndex !==null) {
              currentIndex = scope.currentIndex;
            }
            customPaging = function (slick, index) {
              return scope.customPaging({
                slick: slick,
                index: index
              });
            };
            slider.slick({
              accessibility: scope.accessibility !== 'false',
              adaptiveHeight: scope.adaptiveHeight === 'true',
              arrows: scope.arrows !== 'false',
              asNavFor: scope.asNavFor ? scope.asNavFor : void 0,
              appendArrows: scope.appendArrows ? $(scope.appendArrows) : $(element),
              appendDots: scope.appendDots ? $(scope.appendDots) : $(element),
              autoplay: scope.autoplay === 'true',
              autoplaySpeed: scope.autoplaySpeed !==null ? parseInt(scope.autoplaySpeed, 10) : 3000,
              centerMode: scope.centerMode === 'true',
              centerPadding: scope.centerPadding || '50px',
              cssEase: scope.cssEase || 'ease',
              customPaging: attrs.customPaging ? customPaging : void 0,
              dots: scope.dots === 'true',
              draggable: scope.draggable !== 'false',
              easing: scope.easing || 'linear',
              fade: scope.fade === 'true',
              focusOnSelect: scope.focusOnSelect === 'true',
              infinite: scope.infinite !== 'false',
              initialSlide: scope.initialSlide || 0,
              lazyLoad: scope.lazyLoad || 'ondemand',
              pauseOnHover: scope.pauseOnHover !== 'false',
              responsive: scope.responsive || void 0,
              rtl: scope.rtl === 'true',
              slide: scope.slide || 'div',
              slidesToShow: scope.slidesToShow !==null ? parseInt(scope.slidesToShow, 10) : 1,
              slidesToScroll: scope.slidesToScroll !==null ? parseInt(scope.slidesToScroll, 10) : 1,
              speed: scope.speed !==null ? parseInt(scope.speed, 10) : 300,
              swipe: scope.swipe !== 'false',
              swipeToSlide: scope.swipeToSlide === 'true',
              touchMove: scope.touchMove !== 'false',
              touchThreshold: scope.touchThreshold ? parseInt(scope.touchThreshold, 10) : 5,
              useCSS: scope.useCSS !== 'false',
              variableWidth: scope.variableWidth === 'true',
              vertical: scope.vertical === 'true',
              prevArrow: scope.prevArrow ? $(scope.prevArrow) : void 0,
              nextArrow: scope.nextArrow ? $(scope.nextArrow) : void 0
            });
            slider.on('init', function (event, slick) {
              if (attrs.onInit) {
                scope.onInit();
              }
              if (currentIndex !==null) {
                return slick.slideHandler(currentIndex);
              }
            });
            slider.on('reInit', function () {
              if (attrs.onReInit) {
                return scope.onReInit();
              }
            });
            slider.on('setPosition', function () {
              if (attrs.onSetPosition) {
                return scope.onSetPosition();
              }
            });
            slider.on('swipe', function ( direction) {
              if (attrs.onSwipe) {
                return scope.onSwipe(direction);
              }
            });
            slider.on('afterChange', function (currentSlide) {
              if (scope.onAfterChange) {
                scope.onAfterChange(currentSlide);
              }
              if (currentIndex !==null) {
                return scope.$apply(function () {
                  currentIndex = currentSlide;
                  scope.currentIndex = currentSlide;
                  return scope.currentIndex;
                });
              }
            });
            slider.on('beforeChange', function (currentSlide, nextSlide) {
              if (attrs.onBeforeChange) {
                return scope.onBeforeChange(currentSlide, nextSlide);
              }
            });
            slider.on('breakpoint', function () {
              if (attrs.onBreakpoint) {
                return scope.onBreakpoint();
              }
            });
            slider.on('destroy', function () {
              if (attrs.onDestroy) {
                return scope.onDestroy();
              }
            });
            slider.on('edge', function (direction) {
              if (attrs.onEdge) {
                return scope.onEdge(direction);
              }
            });
            return scope.$watch('currentIndex', function (newVal) {
              if (currentIndex !==null && newVal !==null && newVal !== currentIndex) {
                return slider.slick('slickGoTo', newVal);
              }
            });
          });
        };
        if (scope.initOnload) {
          isInitialized = false;
          return scope.$watch('data', function (newVal) {
            if (newVal !==null) {
              if (isInitialized) {
                destroySlick();
              }
              initializeSlick();
              isInitialized = true;
              return true;
            }
          });
        } else {
          return initializeSlick();
        }
      }
    };
  }
]);