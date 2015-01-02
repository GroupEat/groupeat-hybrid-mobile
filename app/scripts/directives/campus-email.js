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

        // Assert that address starts as an email address
        if (matches === null) {
          ctrl.$setValidity('geCampusEmail', false);
          return undefined;
        }

        // Returns true if domain is in whitelist, false otherwise
        if (domains.indexOf(matches[1]) !== -1) {
          ctrl.$setValidity('geCampusEmail', true);
          return viewValue;
        } else {
          ctrl.$setValidity('geCampusEmail', false);
          return undefined;
        }
      });
    }
  };
});
