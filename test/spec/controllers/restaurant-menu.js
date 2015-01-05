'use strict';

describe('Ctrl: RestaurantMenuCtrl', function () {

    var expect = chai.expect;

    // Load the controller's module
    beforeEach(module('groupeat'));

    var RestaurantMenuCtrl,
    httpBackend,
    scope,
    state;

    beforeEach(inject(function ($controller, $rootScope, $state, $httpBackend) {
        httpBackend = $httpBackend;
        state = $state;
        scope = $rootScope.$new();
        RestaurantMenuCtrl = $controller('RestaurantMenuCtrl', {
            $scope: scope, $state: state
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

        it("discount should be between 0 & 1", function () {
            expect(scope.discount).to.be.within(0,1);
        });

    });
});
