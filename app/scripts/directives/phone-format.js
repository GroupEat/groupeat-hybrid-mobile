'use strict';

angular.module('groupeat.directives.phone-format', [])

.directive('gePhoneFormat', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {

        // Basic email matching
        var regex = /^0[0-9]([ .-]?[0-9]{2}){4}$/i;
        var matches = regex.exec(viewValue);


        ctrl.$setValidity('gePhoneFormat', matches !== null);
        return viewValue;
      });
    }
  };
});
