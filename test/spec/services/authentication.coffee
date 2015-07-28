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

  describe 'Authentication#authentify', ->

    it 'should have a authentify property', ->
      Authentication.should.have.property('authentify')

    it 'should return a fulfilled promise with the response including the token when the server responds properly', ->
      credentials = 'credentials'
      response =
        data:
          token: 'token'
      $httpBackend.whenPUT(ENV.apiEndpoint+'/auth/token').respond(response)
      Authentication.authentify(credentials).should.eventually.have.property('token')
      $httpBackend.flush()

    it 'should reject a promise with an error message when the server responds with an error', ->
      errorMsgFromBackend = 'errorMsgFromBackend'
      sandbox.stub(BackendUtils, 'errorMsgFromBackend').returns(errorMsgFromBackend)
      credentials = 'credentials'
      $httpBackend.whenPUT(ENV.apiEndpoint+'/auth/token').respond(404, 'Failure')
      Authentication.authentify(credentials).should.be.rejectedWith(errorMsgFromBackend)
      $httpBackend.flush()

  describe 'Authentication#resetPassword', ->

    it 'should have a resetPassword property', ->
      Authentication.should.have.property('resetPassword')

    it 'should return a fulfilled promise when the server responds properly', ->
      email = 'email@ensta.fr'
      $httpBackend.whenDELETE(ENV.apiEndpoint+'/auth/password').respond(200, 'Success')
      Authentication.resetPassword(email).should.be.fulfilled
      $httpBackend.flush()

    it 'should reject a promise with an error key when the server responds with an error', ->
      errorKeyFromBackend = 'errorKeyFromBackend'
      sandbox.stub(BackendUtils, 'errorKeyFromBackend').returns(errorKeyFromBackend)
      email = 'email@ensta.fr'
      $httpBackend.whenDELETE(ENV.apiEndpoint+'/auth/password').respond(404, 'Failure')
      Authentication.resetPassword(email).should.be.rejectedWith(errorKeyFromBackend)
      $httpBackend.flush()

  describe 'Authentication#updatePassword', ->

    it 'should have a updatePassword property', ->
      Authentication.should.have.property('updatePassword')

    it 'should return a resolved promise if the authenticationParams do not include oldPassword and newPassword properties', ->
      authenticationParams =
        email: 'email@ensta.fr'
      Authentication.updatePassword(authenticationParams).should.be.resolved
      scope.$digest()

    it 'should return a rejected promise with newPasswordNotProvided  if the authenticationParams include an oldPassword but no newPassword properties', ->
      authenticationParams =
        email: 'email@ensta.fr'
        oldPassword: 'oldPassword'
      Authentication.updatePassword(authenticationParams).should.be.rejectedWith('newPasswordNotProvided')
      scope.$digest()

    it 'should return a rejected promise with oldPasswordNotProvided  if the authenticationParams include an newPassword but no oldPassword properties', ->
      authenticationParams =
        email: 'email@ensta.fr'
        newPassword: 'newPassword'
      Authentication.updatePassword(authenticationParams).should.be.rejectedWith('oldPasswordNotProvided')
      scope.$digest()

    it 'should return a resolved promise if the authenticationParams do include the oldPassword and newPassword properties and if the server responds correctly', ->
      authenticationParams =
        email: 'email@ensta.fr'
        oldPassword: 'oldPassword'
        newPassword: 'newPassword'
      $httpBackend.whenPUT(ENV.apiEndpoint+'/auth/password').respond(200, 'Success')
      Authentication.updatePassword(authenticationParams).should.be.resolved
      $httpBackend.flush()

    it 'should return a rejected promise with the proper error message if the authenticationParams do include the oldPassword and newPassword properties and if the server responds with an error', ->
      authenticationParams =
        email: 'email@ensta.fr'
        oldPassword: 'oldPassword'
        newPassword: 'newPassword'
      errorMsgFromBackend = 'errorMsgFromBackend'
      sandbox.stub(BackendUtils, 'errorMsgFromBackend').returns(errorMsgFromBackend)
      $httpBackend.whenPUT(ENV.apiEndpoint+'/auth/password').respond(404, 'Failure')
      Authentication.updatePassword(authenticationParams).should.be.rejectedWith(errorMsgFromBackend)
      $httpBackend.flush()
