'use strict';

describe('Controller: SettingsCtrl', function () {

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
    it("should have a name and state fields", function () {
      _.forEach(scope.settingsList, function(setting) {
        setting.should.have.property('name');
        setting.should.have.property('state');
      })
    })
  });
});
