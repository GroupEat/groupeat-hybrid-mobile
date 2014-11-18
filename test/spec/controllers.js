'use strict';

describe('Controller: CommandViewController', function () {

  var should = chai.should();

  // load the controller's module
  beforeEach(module('groupeat'));

  var CommandViewController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CommandViewController = $controller('CommandViewController', {
      $scope: scope
    });
  }));

  // test
  it('should be a list of 10 groups', function () {
    scope.groups.should.have.length(10);
  });

});
