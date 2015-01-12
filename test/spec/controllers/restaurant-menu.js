'use strict';

describe('Ctrl: RestaurantMenuCtrl', function () {
  
    // Load the controller's module
    beforeEach(module('groupeat'));

    var RestaurantMenuCtrl,
    httpBackend,
    scope,
    Cart,
    state;

    beforeEach(inject(function ($controller, $rootScope, $state, $httpBackend, Pizza, Cart) {
        httpBackend = $httpBackend;
        state = $state;
        scope = $rootScope.$new();
        RestaurantMenuCtrl = $controller('RestaurantMenuCtrl', {
            $scope: scope, $state: state, Pizza: Pizza, Cart: Cart  
        });
        var mockData = [{key:"test"},{key:"test2"}];
        var url = 'data/pizzas/pizzas_restaurant_.json';
        httpBackend.whenGET(url).respond(mockData);
        httpBackend.whenGET(/^templates\/.*/).respond('<html></html>');
        httpBackend.whenGET(/^translations\/.*/).respond('{}');
    }));

    describe("Constructor", function() {

        beforeEach(function() {
            httpBackend.flush();
        });

        it("should load a list of 2 pizzas", function () {
            scope.pizzas.should.have.length(2);
        });

        it("should create an empty cart", function() {
            expect(scope.cart).not.to.equal(null);
            scope.cart.should.have.property('cartTotalPrice');
            scope.cart.should.have.property('cartTotalQuantity');
            scope.cart.should.have.property('productsItems');

            expect(_.isEmpty(scope.cart.productsItems)).to.be.true;
        });

    });



    describe("State change", function() {

    beforeEach(function() {
      httpBackend.flush();
    });

    it("should call Cart service function add product", function() {
        /*var quantityOfProductItems = scope.cart.totalQuantity ;

        var format = {
            'id': 444,
            'size': 'format test',
            'price': 10,
            'quantity': 1
        };

        var product = {
            'id': 188,
            'name': 'test name',
            'totalQuantity': 1,
            'totalPrice': 12,
            'formats': [{
                'id': 555,
                'size': 'other format test',
                'price': 8,
                'quantity': 0
            },
            format
            ]
        };
        
        scope.onProductAdd(product, format);
        scope.$apply();
        expect(scope.cart.totalQuantity).to.equal(quantityOfProductItems + 1);
    */

        /*var product = {};
        var format= {};

        scope.onProductAdd(product, format);
        expect(Cart.addProductToCart).to.have.been.called();*/

    });

    it("should toggle product if asking", function() {
        var product = {
            'name': 'test',
            'id': 1,
            'description': 'for test'
        };

        scope.toggleDetails(product);
        scope.$apply();
        expect(scope.shownDetails).to.equal(product);
        
    });

    it("should not toggle product if not asking", function() {
        var product = 10;

        scope.shownDetails = product ;
        scope.toggleDetails(product);
        scope.$apply();
        expect(scope.shownDetails).to.equal(null);
    })

    it("should right product be shown", function() {
        var product = {
            'name': 'test',
            'id': 1,
            'description': 'for test',
            'formats':
              [
                {
                  'id': 10,
                  'size':'Junior',
                  'price':8
                },
                {
                  'id': 11,
                  'size':'test',
                  'price':10
                },
                {
                  'id': 12,
                  'size':'test1',
                  'price':12
                }
              ]
        };

        scope.shownDetails = product ;
        expect(scope.isDetailsShown(product)).to.be.true;
        scope.shownDetails = null;
        expect(scope.isDetailsShown(product)).to.be.false;
    });
  });

});
