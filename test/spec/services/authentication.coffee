describe 'Service: Authentication', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.authentication'
    module 'templates'

  $httpBackend = BackendUtils = Authentication = scope = sandbox = localStorageService = mockLocalStorage = ENV = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      Authentication = $injector.get('Authentication')
      localStorageService = $injector.get('localStorageService')
      BackendUtils = $injector.get('BackendUtils')
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
      sandbox.stub(BackendUtils, 'errorMsgFromBackend').returns(errorMsgFromBackend)
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
      sandbox.stub(BackendUtils, 'errorKeyFromBackend').returns(errorKeyFromBackend)
      credentials = 'credentials'
      $httpBackend.whenPOST(ENV.apiEndpoint+'/auth/resetPassword').respond(404, 'Failure')
      Authentication.resetPassword(credentials).should.be.rejectedWith(errorKeyFromBackend)
      $httpBackend.flush()
