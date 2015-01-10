'use strict';

describe('Ctrl: GroupOrdersCtrl', function () {

  var should = chai.should();

  // Load the controller's module
  beforeEach(module('groupeat'));

  var GroupOrdersCtrl,
  httpBackend,
  scope,
  state;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $state, GroupOrder, $httpBackend) {
    httpBackend = $httpBackend;
    state = $state;
    scope = $rootScope.$new();
    GroupOrdersCtrl = $controller('GroupOrdersCtrl', {
      $scope: scope, $state: state, GroupOrder: GroupOrder
    });
    var mockData = [{key:"test"},{key:"test2"}];
    var url = 'data/group-orders.json';
    httpBackend.whenGET(url).respond(mockData);
    httpBackend.whenGET(/^templates\/.*/).respond('<html></html>');
    httpBackend.whenGET(/^translations\/.*/).respond('{}');
  }));

  describe("Constructor", function() {

    beforeEach(function() {
      httpBackend.flush();
    });

    it("current state should be group-orders", function () {
      state.current.name.should.equal('group-orders');
    });

    it("should load a list of 2 group-order", function () {
      scope.groupOrders.should.have.length(2);
    });

  });

});
