'use strict';

describe('Directive: geHideTabs', function () {

  // Load the controller's module
  beforeEach(module('groupeat'));

  var scope,
  elm,
  rootScope,
  httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($compile, $rootScope, $httpBackend) {
    httpBackend = $httpBackend;
    scope = $rootScope.$new();
    var element = angular.element(
      '<ion-view ge-hide-tabs>' +
      '</ion-view>'
    );
    $compile(element)(scope);
    rootScope = $rootScope;
    httpBackend.whenGET(/^templates\/.*/).respond('<html></html>');
    httpBackend.whenGET(/^translations\/.*/).respond('<html></html>');
  }));


  it('should hide tabs', function() {
    scope.$digest();
    expect(rootScope.hideTabs).to.be.true;
  });

  it('should  to true', function() {
    scope.$digest();
    rootScope.$broadcast('$destroy');
    expect(rootScope.hideTabs).to.be.false;
  });

});
