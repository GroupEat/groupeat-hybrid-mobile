'use strict';

describe('Service: _', function () {

  // Load the controller's module
  beforeEach(module('groupeat'));

  var Lodash, scope, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $httpBackend, _) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;
    httpBackend.whenGET(/^templates\/.*/).respond('<html></html>');
    httpBackend.whenGET(/^translations\/.*/).respond('<html></html>');
    Lodash = _;
  }));

  it('Lodash service should equal html window._', function() {
    expect(Lodash).to.equal(window._);
  });

});
