describe 'Service: HttpProviderInterceptor', ->

  HttpProviderInterceptor = Credentials = scope = sandbox = $state = $http = $httpBackend = apiEndpoint = {}

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.http-provider-interceptor'
    module 'config'
    module 'ngConstants'
    module 'templates'

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()
      Credentials = $injector.get('Credentials')
      HttpProviderInterceptor = $injector.get('HttpProviderInterceptor')
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')
      apiEndpoint = $injector.get('apiEndpoint')
      $http = $injector.get('$http')
      $state = $injector.get('$state')

  afterEach ->
    sandbox.restore()

  describe 'Functionnal Testing', ->

    it 'should be defined', ->
      HttpProviderInterceptor.should.be.defined

    it 'should add the accept headers', ->
      $httpBackend.expectGET(apiEndpoint, (headers) ->
        headers.Accept.should.equal('application/vnd.groupeat.v1+json')
      ).respond(200, '')
      $http.get(apiEndpoint)
      $httpBackend.flush()

    it 'should have no authorization headers when the customer is not authorized', ->
      sandbox.stub(Credentials, 'get').returns(undefined)
      $httpBackend.expectGET(apiEndpoint, (headers) ->
        expect(headers.Authorization).to.be.undefined
      ).respond(200, '')
      $http.get(apiEndpoint)
      $httpBackend.flush()

    it 'should have the token in the authorization headers when the customer is authorized', ->
      token = 'token'
      sandbox.stub(Credentials, 'get', ->
        token: token
      )
      $httpBackend.expectGET(apiEndpoint + '/restaurants', (headers) ->
        headers.Authorization.should.contain(token)
      ).respond(404, '')
      $http.get(apiEndpoint + '/restaurants')
      $httpBackend.flush()

  describe 'HttpProviderInterceptor#request', ->

    it 'should return an untouched config if the url does not go to a groupeat server', ->
      config =
        url: 'http://ionic.io/example'
      HttpProviderInterceptor.request(config).should.equal config

    it 'should add a headers.Accept key with the proper value if the url is one of a groupeat server', ->
      config =
        url: 'http://groupeat.fr/example'
        headers: {}
      expectedConfig =
        url: 'http://groupeat.fr/example'
        headers:
          Accept: 'application/vnd.groupeat.v1+json'
      HttpProviderInterceptor.request(config).should.deep.equal expectedConfig

    it 'should add a headers.Accept key with the proper value if the url is one of a groupeat server', ->
      config =
        url: 'http://groupeat.fr/example'
        headers: {}
      HttpProviderInterceptor.request(config).headers.Accept.should.equal 'application/vnd.groupeat.v1+json'

    it 'should not define an Authorization key if Credentials does not have a token key', ->
      sandbox.stub(Credentials, 'get').returns {}
      config =
        url: 'http://groupeat.fr/example'
        headers: {}
      expect(HttpProviderInterceptor.request(config).headers.Authorization).to.be.undefined

    it 'should set the Authorization property to the Credential token if it returns one', ->
      token = 'token'
      sandbox.stub(Credentials, 'get').returns
        token: token
      config =
        url: 'http://groupeat.fr/example'
        headers: {}
      HttpProviderInterceptor.request(config).headers.Authorization.should.equal 'bearer '+token

  describe 'HttpProviderInterceptor#responseError', ->

    beforeEach ->
      sandbox.stub $state, 'go'

    it 'should not call $state.go if the http response code is different from 401', ->
      response =
        status: 404
      HttpProviderInterceptor.responseError(response).should.be.rejectedWith response
      scope.$digest()
      $state.go.should.have.not.been.called

    it 'should not call $state.go if the http response code equals 401 but the response does not have a data.data.errorKey property', ->
      response =
        status: 401
        data:
          data:
            notErrorKey: 'notErrorKey'
      HttpProviderInterceptor.responseError(response).should.be.rejectedWith response
      scope.$digest()
      $state.go.should.have.not.been.called

    it 'should not call $state.go if the http response code equals 401 but the response.data.data.errorKey is not in the keysRequiringRedirection array', ->
      response =
        status: 401
        data:
          data:
            errorKey: 'not in keysRequiringRedirection'
      HttpProviderInterceptor.responseError(response).should.be.rejectedWith response
      scope.$digest()
      $state.go.should.have.not.been.called

    it 'should call $state.go to redirect to authentication if the http response code equals 401 and the response.data.data.errorKey is in the keysRequiringRedirection array', ->
      response =
        status: 401
        data:
          data:
            errorKey: 'userMustAuthenticate'
      HttpProviderInterceptor.responseError(response).should.be.rejectedWith response
      scope.$digest()
      $state.go.should.have.been.calledWithExactly 'app.authentication'
      response =
        status: 401
        data:
          data:
            errorKey: 'invalidAuthenticationTokenSignature'
      HttpProviderInterceptor.responseError(response).should.be.rejectedWith response
      scope.$digest()
      $state.go.should.have.been.calledWithExactly 'app.authentication'
