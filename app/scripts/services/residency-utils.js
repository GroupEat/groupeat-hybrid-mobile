'use strict';

angular.module('groupeat.services.residency-utils', [])

.factory('ResidencyUtils', [
  function () {

    var /**
    * @ngdoc function
    * @name ResidencyUtils#_endsWith
    * @methodOf ResidencyUtils
    *
    * @description
    * (Private Method) Checks if the given string ends with a given suffix
    *
    * @param {String} str - The string to check
    * @param {String} suffix - The suffix to check
    */
    _endsWith = function (str, suffix) {
      if (typeof str === 'string' || str instanceof String)
      {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
      }
      return false;
    },

    /**
    * @ngdoc function
    * @name ResidencyUtils#getDefaultResidencyValueFromEmail
    * @methodOf ResidencyUtils
    *
    * @description
    * Returns the default value (as it is stored in the database and used in the html select)
    * of the residency of the user, given his/her email
    *
    * @param {String} email - The email of the user
    */
    getDefaultResidencyValueFromEmail = function (email) {
      if (_endsWith(email, 'polytechnique.edu'))
      {
        return 2;
      }
      else if (_endsWith(email, 'institutoptique.fr'))
      {
        return 3;
      }
      return 1;
    };

    return {
      getDefaultResidencyValueFromEmail: getDefaultResidencyValueFromEmail
    };
  }
]);
