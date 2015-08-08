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
        var regex = /^[0-9]{10}$/i;
        var matches = regex.exec(viewValue);
        return matches !== null;
      };
    }
  };
});
