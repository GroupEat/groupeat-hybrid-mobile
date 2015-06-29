'use strict';
angular.module('groupeat.directives.phone-format', []).directive('gePhoneFormat', function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      ctrl.$validators.gePhoneFormat = function (modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return true;
        }
        // Basic email matching
        var regex = /^0[0-9]([ .-]?[0-9]{2}){4}$/i;
        var matches = regex.exec(viewValue);
        return matches !== null;
      };
    }
  };
});