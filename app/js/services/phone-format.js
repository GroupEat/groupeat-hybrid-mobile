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

  var formatPhoneNumberForFrontend = function(phoneNumber) {
    if (phoneNumber && phoneNumber.length > 10 && phoneNumber.substring(0,2) === '33') {
      phoneNumber = '0' + phoneNumber.substring(2);
    }
    return phoneNumber;
  };

  return {
    formatPhoneNumberForBackend: formatPhoneNumberForBackend,
    formatPhoneNumberForFrontend: formatPhoneNumberForFrontend
  };
});
