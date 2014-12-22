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

  describe("#isGroupShown", function() {
    
  });

});

describe('Controller: SettingsCtrl', function () {

  var should = chai.should();

  // load the controller's module
  beforeEach(module('groupeat'));

  var SettingsCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SettingsCtrl = $controller('SettingsCtrl', {
      $scope: scope
    });
  }));

  describe("Constructor", function() {
    // Tests
    it("should create a list of 2 settings", function () {
      scope.settingsList.should.have.length(2);
    });
    it("should have a name and onTap fields", function () {
      _.forEach(scope.settingsList, function(setting) {
        setting.should.have.property('name');
        setting.should.have.property('onTap');
      })
    })
  });



});
