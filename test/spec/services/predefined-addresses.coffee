describe 'Service: PredefinedAddresses', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.predefined-addresses'

  PredefinedAddresses = scope = $httpBackend = ENV = sandbox = BackendUtils = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')
      PredefinedAddresses = $injector.get('PredefinedAddresses')
      ENV = $injector.get('ENV')
      sandbox = sinon.sandbox.create()

  describe 'PredefinedAddresses#get', ->

    it 'should have an get method', ->
      PredefinedAddresses.should.have.property('get')

    it 'should return a fulfilled promise when the request returns a 200 status', ->
      addresses = []
      response =
        data:
          addresses
      $httpBackend.expect('GET', ENV.apiEndpoint+'/predefinedAddresses').respond(response)
      PredefinedAddresses.get().should.become(addresses)
      $httpBackend.flush()

    it 'should reject a promise with an error message when the server responds with an error', ->
      $httpBackend.expect('GET', ENV.apiEndpoint+'/predefinedAddresses').respond(400, 'Failure')
      PredefinedAddresses.get().should.be.rejected
      $httpBackend.flush()
