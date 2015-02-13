describe 'Service: Authentication', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.authentication'

  $httpBackend = ElementModifier = Authentication = scope = sandbox = localStorageService = mockLocalStorage = ENV = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      Authentication = $injector.get('Authentication')
      localStorageService = $injector.get('localStorageService')
      ElementModifier = $injector.get('ElementModifier')
      ENV = $injector.get('ENV')
      sandbox.stub(localStorageService, 'get', (key) ->
        return mockLocalStorage[key]
      )
      sandbox.stub(localStorageService, 'set', (key, value) ->
        mockLocalStorage[key] = value
      )
      sandbox.stub(localStorageService, 'remove', (key) ->
        delete mockLocalStorage[key]
      )

  afterEach ->
    sandbox.restore()

  describe 'Credentials', ->

    afterEach ->
      mockLocalStorage = {}

    it 'should initially return undefined when getting the customer credentials', ->
      expect(Authentication.getCredentials()).to.be.undefined

    it 'should return credentials when they were previously set', ->
      id = 1
      token = 'token'
      Authentication.setCredentials(id, token)
      Authentication.getCredentials().id.should.equal(id)
      Authentication.getCredentials().token.should.equal(token)

    it 'should return undefined when they were previously set but reset afterwards', ->
      id = 1
      token = 'token'
      Authentication.setCredentials(id, token)
      Authentication.resetCredentials()
      expect(Authentication.getCredentials()).to.be.undefined

    it 'should return undefined when there is just a token stored in local storage', ->
      localStorageService.set('token', 'token')
      expect(Authentication.getCredentials()).to.be.undefined

    it 'should return undefined when there is just an id stored in local storage', ->
      localStorageService.set('id', 1)
      expect(Authentication.getCredentials()).to.be.undefined

    it 'should throw an error when the given user id is not an integer', ->
      expect( -> Authentication.setCredentials('notAnInteger', 'token')).to.throw(Error, 'The customer id is not an integer')

  describe 'Authentication#getToken', ->

    it 'should have a getToken property', ->
      Authentication.should.have.property('getToken')

    it 'should return a fulfilled promise with the response including the token when the server responds properly', ->
      credentials = 'credentials'
      response = {token: 'token'}
      $httpBackend.whenPUT(ENV.apiEndpoint+'/auth/token').respond(response)
      Authentication.getToken(credentials).should.eventually.have.property('token')
      $httpBackend.flush()

    it 'should reject a promise with an error message when the server responds with an error', ->
      errorMsgFromBackend = 'errorMsgFromBackend'
      sandbox.stub(ElementModifier, 'errorMsgFromBackend').returns(errorMsgFromBackend)
      credentials = 'credentials'
      $httpBackend.whenPUT(ENV.apiEndpoint+'/auth/token').respond(404, 'Failure')
      Authentication.getToken(credentials).should.be.rejectedWith(errorMsgFromBackend)
      $httpBackend.flush()

  describe 'Authentication#resetPassword', ->

    it 'should have a resetPassword property', ->
      Authentication.should.have.property('resetPassword')

    it 'should return a fulfilled promise when the server responds properly', ->
      credentials = 'credentials'
      $httpBackend.whenPOST(ENV.apiEndpoint+'/auth/resetPassword').respond(200, 'Success')
      Authentication.resetPassword(credentials).should.be.fulfilled
      $httpBackend.flush()

    it 'should reject a promise with an error key when the server responds with an error', ->
      errorKeyFromBackend = 'errorKeyFromBackend'
      sandbox.stub(ElementModifier, 'errorKeyFromBackend').returns(errorKeyFromBackend)
      credentials = 'credentials'
      $httpBackend.whenPOST(ENV.apiEndpoint+'/auth/resetPassword').respond(404, 'Failure')
      Authentication.resetPassword(credentials).should.be.rejectedWith(errorKeyFromBackend)
      $httpBackend.flush()
