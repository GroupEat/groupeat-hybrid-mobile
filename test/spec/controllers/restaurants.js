'use strict';

describe('Ctrl: RestaurantsCtrl', function () {

    var should = chai.should();

    // Load the controller's module
    beforeEach(module('groupeat'));

    var RestaurantsCtrl,
    httpBackend,
    scope,
    state;

    beforeEach(inject(function ($controller, $rootScope, $state, $httpBackend) {
        httpBackend = $httpBackend;
        state = $state;
        scope = $rootScope.$new();
        RestaurantsCtrl = $controller('RestaurantsCtrl', {
            $scope: scope, $state: state
        });
        var mockData = [{key:"test"},{key:"test2"}];
        var url = 'data/restaurants.json';
        httpBackend.whenGET(url).respond(mockData);
        httpBackend.whenGET(/^templates\/.*/).respond('<html></html>');
        httpBackend.whenGET(/^translations\/.*/).respond('{}');
    }));

    describe("State Change", function() {

        beforeEach(function() {
            httpBackend.flush();
        });

        it("state should change to restaurant menu view", function () {
            var restaurantId = 1;
            scope.goRestaurantMenu(restaurantId);
            scope.$apply();
            state.current.name.should.equal('restaurant-menu');
        });

    });
});
