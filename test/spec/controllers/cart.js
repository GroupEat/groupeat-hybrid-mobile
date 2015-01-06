'use strict';

describe('Ctrl: CartCtrl', function () {

  var should = chai.should();

  // Load the controller's module
  beforeEach(module('groupeat'));

  var CartCtrl,
  httpBackend,
  scope,
  state;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $state, Cart, $httpBackend) {
    httpBackend = $httpBackend;
    state = $state;
    scope = $rootScope.$new();
    CartCtrl = $controller('CartCtrl', {
      $scope: scope, $state: state, Cart: Cart, _:_
    });
    var mockData = [{key:"test"},{key:"test2"}];
    var url = 'data/cart.json';
    httpBackend.whenGET(url).respond(mockData);
    httpBackend.whenGET(/^templates\/.*/).respond('<html></html>');
    httpBackend.whenGET(/^translations\/.*/).respond('{}');
  }));

  describe("Constructor", function() {

    beforeEach(function() {
      httpBackend.flush();
    });


    it("should load a list of 2 orders", function () {
      scope.cart.should.have.length(2);
    });

  });

  describe("State Change", function() {

    beforeEach(function() {
      httpBackend.flush();
    });

    it("number of cart's item should decrease by one ", function () {
      var numberOfItemBefore = scope.cart.length ;
      scope.onItemDelete();
      scope.$apply();
      expect(numberOfItemBefore -  scope.cart.length).to.equal(1);
    });

    it("nothing should happen on confirm command touch ", function () {
      scope.onConfirmCommandTouch();
      scope.$apply();
    });
  });
});
