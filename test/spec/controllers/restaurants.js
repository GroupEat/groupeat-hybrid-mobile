'use strict';

describe('Ctrl: RestaurantsCtrl', function () {

    // Load the controller's module
    beforeEach(module('groupeat'));

    var RestaurantsCtrl,
    httpBackend,
    scope,
    state;

    beforeEach(inject(function ($controller, $rootScope, $state, $httpBackend) {
        scope = $rootScope.$new();
        state = $state;
        httpBackend = $httpBackend;
        RestaurantsCtrl = $controller('RestaurantsCtrl', {
            $scope: scope, $state: state
        });
        var mockData = [{key:"test"},{key:"test2"}];
        var url = 'data/restaurants.json';
        httpBackend.whenGET(url).respond(mockData);
        httpBackend.whenGET(/^templates\/.*/).respond('<html></html>');
        httpBackend.whenGET(/^translations\/.*/).respond('{}');
    }));

    describe("Constructor", function() {

        beforeEach(function() {
            httpBackend.flush();
        });

        it("should load a list of 2 restaurants", function () {
            scope.restaurants.should.have.length(2);
        });

    });

});
