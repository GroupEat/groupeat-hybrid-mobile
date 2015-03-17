describe 'Service: GroupOrder', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.group-order'

  GroupOrder = scope = $httpBackend = ENV = sandbox = BackendUtils = Customer = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')
      GroupOrder = $injector.get('GroupOrder')
      ENV = $injector.get('ENV')
      BackendUtils = $injector.get('BackendUtils')
      sandbox = sinon.sandbox.create()

  afterEach ->
    mockLocalStorage = {}

  describe 'GroupOrder#get', ->

    it 'should have an get method', ->
      GroupOrder.should.have.property('get')

    it 'should return a fulfilled promise when the request returns a 200 status', ->
      regex = new RegExp('^'+ENV.apiEndpoint+'/groupOrders\\?joinable=1&around=\\d+&latitude=\\d+&longitude=1&include=restaurant$')
      orders = []
      response =
        data:
          orders
      $httpBackend.expect('GET', regex).respond(response)
      GroupOrder.get(1, 1).should.become(orders)
      $httpBackend.flush()

    it 'should reject a promise with an error message when the server responds with an error', ->
      errorMsgFromBackend = 'errorMsgFromBackend'
      sandbox.stub(BackendUtils, 'errorMsgFromBackend').returns(errorMsgFromBackend)
      regex = new RegExp('^'+ENV.apiEndpoint+'/groupOrders\\?joinable=1&around=1&latitude=\\d+&longitude=\\d+&include=restaurant$')
      $httpBackend.expect('GET', regex).respond(400, 'Failure')
      GroupOrder.get(1, 1).should.be.rejectedWith(errorMsgFromBackend)
      $httpBackend.flush()
