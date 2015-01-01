'use strict';

describe('Ctrl: OrdersCtrl', function () {

  var should = chai.should();

  // Load the controller's module
  beforeEach(module('groupeat'));

  var OrdersCtrl,
  httpBackend,
  scope,
  state;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $state, Order, $httpBackend) {
    httpBackend = $httpBackend;
    state = $state;
    scope = $rootScope.$new();
    OrdersCtrl = $controller('OrdersCtrl', {
      $scope: scope, $state: state, Order: Order
    });
    var mockData = [{key:"test"},{key:"test2"}];
    var url = 'data/orders.json';
    httpBackend.whenGET(url).respond(mockData);
    httpBackend.whenGET(/^templates\/.*/).respond('<html></html>');
    httpBackend.whenGET(/^translations\/.*/).respond('{}');
  }));

  describe("Constructor", function() {

    beforeEach(function() {
      httpBackend.flush();
    });

    it("current state should be orders", function () {
      state.current.name.should.equal('orders');
    });

    it("should load a list of 2 orders", function () {
      scope.orders.should.have.length(2);
    });

  });

  describe("State Change", function() {

    beforeEach(function() {
      httpBackend.flush();
    });

    it("state should change to food choice", function () {
      scope.onNewOrderTap();
      scope.$apply();
      state.current.name.should.equal('food-choice');
    });

  });

});
