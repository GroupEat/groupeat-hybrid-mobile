'use strict';

describe('Ctrl: BottomTabsCtrl', function () {

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
