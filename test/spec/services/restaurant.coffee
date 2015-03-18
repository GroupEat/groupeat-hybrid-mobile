describe 'Service: Restaurant', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.restaurant'

  Restaurant = scope = $httpBackend = ENV = sandbox = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')
      Restaurant = $injector.get('Restaurant')
      ENV = $injector.get('ENV')
      sandbox = sinon.sandbox.create()

  describe 'Restaurant#get', ->

    it 'should have an get method', ->
      Restaurant.should.have.property('get')
    it 'should return a fulfilled promise when the request returns a 200 status', ->
      regex = new RegExp('^'+ENV.apiEndpoint+'/restaurants\\?opened=1&around=1&latitude=\\d+&longitude=1$')
      restaurants = []
      response =
        data:
          restaurants
      $httpBackend.expect('GET', regex).respond(response)
      Restaurant.get(1, 1).should.become(restaurants)
      $httpBackend.flush()

    it 'should reject a promise with an error message when the server responds with an error', ->
      regex = new RegExp('^'+ENV.apiEndpoint+'/restaurants\\?opened=1&around=1&latitude=\\d+&longitude=1$')
      $httpBackend.expect('GET', regex).respond(400, 'Failure')
      Restaurant.get(1, 1).should.be.rejected
      $httpBackend.flush()
