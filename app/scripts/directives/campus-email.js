'use strict';

angular.module('groupeat.directives.campus-email', [])

.directive('geCampusEmail', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {

        var domains = ['ensta-paristech.fr', 'ensta.fr', 'polytechnique.edu', 'institutoptique.fr'];

        // Basic email matching
        var regex = /^[\w-]+(?:\.[\w-]+)*@(.*)$/i;
        var matches = regex.exec(viewValue);

        ctrl.$setValidity('geCampusEmail', matches !== null && domains.indexOf(matches[1]) !== -1);
        return viewValue;
      });
    }
  };
});
