describe 'Service: Customer', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.customer'

  Customer = scope = $httpBackend = ENV = sandbox = ElementModifier = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')
      Customer = $injector.get('Customer')
      ENV = $injector.get('ENV')
      ElementModifier = $injector.get('ElementModifier')
      sandbox = sinon.sandbox.create()

  afterEach ->
    mockLocalStorage = {}

  describe 'Customer#save', ->

    it 'should have an save method', ->
      Customer.should.have.property('save')

    it 'should return a fulfilled promise with the user id and the token when the server responds normally', ->
      requestBody = {}
      response = {id: 1, token: 'token'}
      $httpBackend.whenPOST(ENV.apiEndpoint+'/customers').respond(response)
      customer = Customer.save(requestBody)
      customer.should.eventually.have.property('id').and.equal(1)
      customer.should.eventually.have.property('token').and.equal('token')
      $httpBackend.flush()

    it 'should reject a promise with an error message when the server responds with an error', ->
      errorMsgFromBackend = 'errorMsgFromBackend'
      sandbox.stub(ElementModifier, 'errorMsgFromBackend').returns(errorMsgFromBackend)
      requestBody = {}
      $httpBackend.whenPOST(ENV.apiEndpoint+'/customers').respond(400, 'Failure')
      Customer.save(requestBody).should.be.rejectedWith(errorMsgFromBackend)
      $httpBackend.flush()

  describe 'Customer#update', ->

    it 'should have an update method', ->
      Customer.should.have.property('update')

    it 'should return a fulfilled promise when the request returns a 200 status', ->
      parameters = {id: 1}
      requestBody = {}
      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+$')
      $httpBackend.expect('PATCH', regex).respond(200, 'Success')
      Customer.update(parameters, requestBody)
      $httpBackend.flush()

    it 'should reject a promise with an error message when the server responds with an error', ->
      errorMsgFromBackend = 'errorMsgFromBackend'
      sandbox.stub(ElementModifier, 'errorMsgFromBackend').returns(errorMsgFromBackend)
      parameters = {id: 1}
      requestBody = {}
      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+$')
      $httpBackend.expect('PATCH', regex).respond(400, 'Failure')
      Customer.update(parameters, requestBody).should.be.rejectedWith(errorMsgFromBackend)
      $httpBackend.flush()
