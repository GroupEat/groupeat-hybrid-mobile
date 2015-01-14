'use strict';

describe('Service: Customer', function () {

  // Load the controller's module
  beforeEach(module('groupeat'));

  var Customer, scope, httpBackend, ENV;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $httpBackend, _Customer_, _ENV_) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;
    httpBackend.whenGET(/^templates\/.*/).respond('<html></html>');
    httpBackend.whenGET(/^translations\/.*/).respond('<html></html>');
    Customer = _Customer_;
    ENV = _ENV_;
  }));

  it('get method is expected to fetch the proper response', function() {
    httpBackend.expectGET(ENV.apiEndpoint+'/customers').respond(
    {
      id:7,
      token: 'jklhkjhlkhl'
    });
    var result = Customer.get();
    httpBackend.flush();
    expect(result.id).to.equal(7);
    expect(result.token).to.equal('jklhkjhlkhl');
  });

});
