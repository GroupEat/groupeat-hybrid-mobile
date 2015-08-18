describe 'Service: Customer', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.customer'
    module 'templates'

  Address = Credentials = Customer = scope = $httpBackend = $q = $state = ENV = sandbox = BackendUtils = Popup = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')
      Address = $injector.get('Address')
      Credentials = $injector.get('Credentials')
      Customer = $injector.get('Customer')
      ENV = $injector.get('ENV')
      $q = $injector.get('$q')
      BackendUtils = $injector.get('BackendUtils')
      Popup = $injector.get('Popup')
      sandbox = sinon.sandbox.create()
      $state = $injector.get('$state')

  afterEach ->
    sandbox.restore()

  describe 'Customer#get', ->

    it 'should have an get method', ->
      Customer.should.have.property('get')

    it 'should return a fulfilled promise with the data from response when the request returns a 200 status', ->
      id = 1
      customer = 'customer'
      response =
        data: customer
      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+$')
      $httpBackend.expect('GET', regex).respond(response)
      Customer.get(id).should.become(customer)
      $httpBackend.flush()

    it 'should reject a promise when the server responds with an error', ->
      id = 1
      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+$')
      $httpBackend.expect('GET', regex).respond(400, 'Failure')
      Customer.get(id).should.be.rejected
      $httpBackend.flush()

    it 'should change the state to authentication if we get a 404 (customer not found)', ->
      sandbox.stub($state, 'go')
      id = 1
      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+$')
      $httpBackend.expect('GET', regex).respond(404, 'Customer not found')
      Customer.get(id).should.be.rejected
      $httpBackend.flush()
      $state.go.should.have.been.calledWithExactly('authentication')

  describe 'Customer#save', ->

    it 'should have an save method', ->
      Customer.should.have.property('save')

    it 'should return a fulfilled promise with the user id and the token when the server responds normally', ->
      requestBody = {}
      response =
        data:
          id: 1
          token: 'token'
      $httpBackend.whenPOST(ENV.apiEndpoint+'/customers').respond(response)
      customer = Customer.save(requestBody)
      customer.should.eventually.have.property('id').and.equal(1)
      customer.should.eventually.have.property('token').and.equal('token')
      $httpBackend.flush()

    it 'should reject a promise with an error message when the server responds with an error', ->
      errorMsgFromBackend = 'errorMsgFromBackend'
      sandbox.stub(BackendUtils, 'errorMsgFromBackend').returns(errorMsgFromBackend)
      requestBody = {}
      $httpBackend.whenPOST(ENV.apiEndpoint+'/customers').respond(400, 'Failure')
      Customer.save(requestBody).should.be.rejectedWith(errorMsgFromBackend)
      $httpBackend.flush()

  describe 'Customer#update', ->

    it 'should have an update method', ->
      Customer.should.have.property('update')

    it 'should return a fulfilled promise when the request returns a 200 status', ->
      requestBody = {}
      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+$')
      $httpBackend.expect('PUT', regex).respond(200, 'Success')
      Customer.update("1", requestBody)
      $httpBackend.flush()

    it 'should reject a promise with an error message when the server responds with an error', ->
      errorMsgFromBackend = 'errorMsgFromBackend'
      sandbox.stub(BackendUtils, 'errorMsgFromBackend').returns(errorMsgFromBackend)
      requestBody = {}
      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+$')
      $httpBackend.expect('PUT', regex).respond(400, 'Failure')
      Customer.update("1", requestBody).should.be.rejectedWith(errorMsgFromBackend)
      $httpBackend.flush()

  describe 'Customer#checkMissingInformation', ->

    it 'should resolve a promise when the Customer GET and Address GET requests succeed and no required information is missing', ->
      customerGetResponse =
        data:
          firstName: 'firstName'
          lastName: 'lastName'
          phoneNumber: '0606060606'
      sandbox.stub(Credentials, 'get').returns(id: 1)
      sandbox.stub(Address, 'get').returns $q.when
        details: 'Au niveau du clocher de TibDex'
        residency: 'aux toilettes'

      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+$')
      $httpBackend.expect('GET', regex).respond(customerGetResponse)
      Customer.checkMissingInformation().should.be.resolved
      $httpBackend.flush()

    it 'should reject a promise with the string "address" when just the customer address is missing', ->
      sandbox.stub(Popup, 'confirm')
      customerGetResponse =
        data:
          firstName: 'firstName'
          lastName: 'lastName'
          phoneNumber: '0606060606'
      sandbox.stub(Credentials, 'get').returns(id: 1)
      sandbox.stub(Address, 'get').returns $q.when
        details: ''
        residency: ''

      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+$')
      $httpBackend.expect('GET', regex).respond(customerGetResponse)
      Customer.checkMissingInformation().should.be.rejectedWith('address')
      $httpBackend.flush()
      Popup.confirm.should.have.been.calledWithExactly

    it 'should reject a promise with a string of the missing customer keys when just the customer get returns an incomplete profile (> 2 missing)', ->
      sandbox.stub(Popup, 'confirm')
      customerGetResponse =
        data: {}
      sandbox.stub(Credentials, 'get').returns(id: 1)
      sandbox.stub(Address, 'get').returns $q.when
        details: 'Chez la mère Michelle'
        residency: 'à gauche'

      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+$')
      $httpBackend.expect('GET', regex).respond(customerGetResponse)
      Customer.checkMissingInformation().should.be.rejectedWith('firstName, lastName and phoneNumber')
      $httpBackend.flush()
      Popup.confirm.should.have.been.calledWithExactly

    it 'should reject a promise with a string of the missing customer keys when just the customer get returns an incomplete profile (2 missing)', ->
      sandbox.stub(Popup, 'confirm')
      customerGetResponse =
        data:
          firstName: 'firstName'
      sandbox.stub(Credentials, 'get').returns(id: 1)
      sandbox.stub(Address, 'get').returns $q.when
        details: 'bonjour'
        residency: 'madame'

      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+$')
      $httpBackend.expect('GET', regex).respond(customerGetResponse)
      Customer.checkMissingInformation().should.be.rejectedWith('lastName and phoneNumber')
      $httpBackend.flush()
      Popup.confirm.should.have.been.calledWithExactly
