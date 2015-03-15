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
