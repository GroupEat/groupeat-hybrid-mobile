'use strict';

describe('Ctrl: CartCtrl', function () {

  // Load the controller's module
  beforeEach(module('groupeat'));

  var CartCtrl,
  httpBackend,
  scope,
  state;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $state, $httpBackend, Cart, _) {
    httpBackend = $httpBackend;
    state = $state;
    scope = $rootScope.$new();
    CartCtrl = $controller('CartCtrl', {
      $scope: scope, $state: state, _:_, Cart: Cart
    });
    httpBackend.whenGET(/^templates\/.*/).respond('<html></html>');
    httpBackend.whenGET(/^translations\/.*/).respond('{}');
  }));

  describe("Constructor", function() {

    beforeEach(function() {
      httpBackend.flush();
    });

  });

  describe("State Change", function() {

    beforeEach(function() {
      httpBackend.flush();
    });
  });

});
