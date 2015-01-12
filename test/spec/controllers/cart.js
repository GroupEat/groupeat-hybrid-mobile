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

    it("cart should have been created", function() {
      scope.cart.should.have.property('cartTotalPrice');
      scope.cart.should.have.property('cartTotalQuantity');
      scope.cart.should.have.property('productsItems');
    });
      

    it("cart should be empty if no productsItems have been added", function() {
      if (_.isEmpty(scope.cart.productsItems)) {
        expect(scope.isCartEmpty).to.be.true;
      }
      else {
        expect(scope.isCartEmpty).to.be.false;
      }
    });
  });


});
