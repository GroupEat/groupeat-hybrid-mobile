describe 'Service: HttpProviderInterceptor', ->

  HttpProviderInterceptor = Credentials = scope = sandbox = $state = $http = $httpBackend = ENV = {}

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.http-provider-interceptor'
    module 'config'
    module 'constants'
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
      ENV = $injector.get('ENV')
      $http = $injector.get('$http')
      $state = $injector.get('$state')
      sandbox.stub($state, 'go')

  afterEach ->
    sandbox.restore()

  it 'should be defined', ->
    HttpProviderInterceptor.should.be.defined

  it 'should add the accept headers', ->
    $httpBackend.expectGET(ENV.apiEndpoint, (headers) ->
      headers.Accept.should.equal('application/vnd.groupeat.v1+json')
    ).respond(200, '')
    $http.get(ENV.apiEndpoint)
    $httpBackend.flush()

  it 'should have no authorization headers when the customer is not authorized', ->
    sandbox.stub(Credentials, 'get').returns(undefined)
    $httpBackend.expectGET(ENV.apiEndpoint, (headers) ->
      expect(headers.Authorization).to.be.undefined
    ).respond(200, '')
    $http.get(ENV.apiEndpoint)
    $httpBackend.flush()

  it 'should have the token in the authorization headers when the customer is authorized', ->
    token = 'token'
    sandbox.stub(Credentials, 'get', ->
      token: token
    )
    $httpBackend.expectGET(ENV.apiEndpoint + '/restaurants', (headers) ->
      headers.Authorization.should.contain(token)
    ).respond(404, '')
    $http.get(ENV.apiEndpoint + '/restaurants')
    $httpBackend.flush()
