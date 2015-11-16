describe 'Service: Restaurant', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.restaurant'

  Restaurant = scope = $httpBackend = apiEndpoint = sandbox = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')
      Restaurant = $injector.get('Restaurant')
      apiEndpoint = $injector.get('apiEndpoint')
      sandbox = sinon.sandbox.create()

  describe 'Restaurant#getFromCoordinates', ->

    it 'should have an get method', ->
      Restaurant.should.have.property 'getFromCoordinates'

    it 'should return a fulfilled promise when the request returns a 200 status', ->
      regex = new RegExp('^'+apiEndpoint+'/restaurants\\?opened=1&around=1&latitude=\\d+&longitude=1$')
      restaurants = []
      response =
        data:
          restaurants
      $httpBackend.expect('GET', regex).respond(response)
      Restaurant.getFromCoordinates(1, 1).should.become(restaurants)
      $httpBackend.flush()

    it 'should reject a promise with an error message when the server responds with an error', ->
      regex = new RegExp('^'+apiEndpoint+'/restaurants\\?opened=1&around=1&latitude=\\d+&longitude=1$')
      $httpBackend.expect('GET', regex).respond(400, 'Failure')
      Restaurant.getFromCoordinates(1, 1).should.be.rejected
      $httpBackend.flush()
