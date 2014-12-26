'use strict';

describe('Ctrl: CommandViewCtrl', function () {

  var should = chai.should();

  // load the controller's module
  beforeEach(module('groupeat'));

  var CommandViewCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CommandViewCtrl = $controller('CommandViewCtrl', {
      $scope: scope
    });
  }));

  describe("Constructor", function() {
    // Tests
    it("should create a list of 10 groups", function () {
      scope.groups.should.have.length(10);
    });

    it("no group should be initially shown", function () {
      assert.isNull(scope.shownGroup);
    });
  });

  describe("#toggleGroup", function() {

    it("should toggle a group", function () {
      var group = scope.groups[2];
      scope.toggleGroup(group);
      assert.isNotNull(scope.shownGroup);
      assert.equal(scope.shownGroup, group);

      scope.toggleGroup(group);
      assert.isNull(scope.shownGroup);
    });

    it("should toggle groups", function () {
      var firstGroup = scope.groups[2];
      scope.toggleGroup(firstGroup);
      assert.isNotNull(scope.shownGroup);
      assert.equal(scope.shownGroup, firstGroup);

      var secondGroup = scope.groups[3];
      scope.toggleGroup(secondGroup);
      assert.notEqual(scope.shownGroup, firstGroup);
      assert.equal(scope.shownGroup, secondGroup);
    });

  });

});

