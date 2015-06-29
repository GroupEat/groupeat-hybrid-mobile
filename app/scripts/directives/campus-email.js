'use strict';
angular.module('groupeat.directives.campus-email', []).directive('geCampusEmail', function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      ctrl.$validators.geCampusEmail = function (modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return true;
        }
        var domains = [
          'ensta-paristech.fr',
          'ensta.fr',
          'polytechnique.edu',
          'institutoptique.fr'
        ];
        // Basic email matching
        var regex = /^[\w-]+(?:\.[\w-]+)*@(.*)$/i;
        var matches = regex.exec(viewValue);
        if (matches === null) {
          return true;
        }
        return domains.indexOf(matches[1]) !== -1;
      };
    }
  };
});