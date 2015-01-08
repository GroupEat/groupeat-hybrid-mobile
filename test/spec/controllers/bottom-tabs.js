'use strict';

describe('Ctrl: BottomTabsCtrl', function () {

    var expect = chai.expect;
    var should = chai.should();

    // Load the controller's module
    beforeEach(module('groupeat'));

    var BottomTabsCtrl,
    httpBackend,
    scope,
    state;

    beforeEach(inject(function ($controller, $rootScope, $state, $httpBackend) {
        httpBackend = $httpBackend;
        state = $state;
        scope = $rootScope.$new();
        BottomTabsCtrl = $controller('BottomTabsCtrl', {
            $scope: scope, $state: state
        });
        // var mockData = [{key:"test"},{key:"test2"}];
        // var url = 'data/pizzas/pizzas_restaurant_.json';
        // httpBackend.whenGET(url).respond(mockData);
        httpBackend.whenGET(/^templates\/.*/).respond('<html></html>');
        httpBackend.whenGET(/^translations\/.*/).respond('{}');
    }));

    describe("Constructor", function() {

        beforeEach(function() {
            httpBackend.flush();
        });

        it("should load a list of 2 tabs", function () {
            scope.bottomTabs.should.have.length(2);
        });

    });

});
