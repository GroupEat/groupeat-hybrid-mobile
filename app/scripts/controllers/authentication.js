'use strict';

angular.module('groupeat.controllers.authentication', ['groupeat.services.utils'])

.controller('AuthenticationCtrl', function ($scope) {
  $scope.user = {username: 'john.doe', password: 'foobar'};
  $scope.message = '';

  /*
  This mock method will keep a random user id and a token.
  In the real world, these info shall be fetched from the back-end
  */
  $scope.submit = function () {
    //$localStorage.set('userId', _.random(0, 5));
    //$localStorage.set('token', 'eyJ0eXAiOiJKV1QiLA0KICJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJqb2UiLA0KICJleHAiOjEzMDA4MTkzODAsDQogImh0dHA6Ly9leGFtcGxlLmNvbS9pc19yb290Ijp0cnVlfQ.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk');
  };
});
