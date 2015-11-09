'use strict';

angular.module('groupeat.services.phone-format', [
])

.factory('PhoneFormat', function () {

  var formatPhoneNumberForBackend = function(phoneNumber) {
    if (phoneNumber && phoneNumber.length === 10) {
      phoneNumber = '33' + phoneNumber.substring(1);
    }
    return phoneNumber;
  };

  return {
    formatPhoneNumberForBackend: formatPhoneNumberForBackend
  };
});
