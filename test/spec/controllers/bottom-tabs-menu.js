'use strict';

describe('Ctrl: BottomTabsMenuCtrl', function () {

    var should = chai.should();

    // Load the controller's module
    beforeEach(module('groupeat'));

    var BottomTabsMenuCtrl,
    httpBackend,
    scope,
    state;

    beforeEach(inject(function ($controller, $rootScope, $state, $httpBackend) {
        httpBackend = $httpBackend;
        state = $state;
        scope = $rootScope.$new();
        BottomTabsMenuCtrl = $controller('BottomTabsMenuCtrl', {
            $scope: scope, $state: state
        });
        httpBackend.whenGET(/^templates\/.*/).respond('<html></html>');
        httpBackend.whenGET(/^translations\/.*/).respond('{}');
    }));

    describe("State Change", function() {

        beforeEach(function() {
            httpBackend.flush();
        });

        it("state should change to orders view", function () {
            scope.onOrdersTabTouch();
            scope.$apply();
            state.current.name.should.equal('orders');
        });

        it("state should change to settings view", function () {
            scope.onSettingsTabTouch();
            scope.$apply();
            state.current.name.should.equal('settings');
        });

    });
});
