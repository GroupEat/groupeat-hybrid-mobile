describe 'Service: HttpProviderInterceptor', ->

  HttpProviderInterceptor = Authentication = scope = sandbox = $httpBackend = ENV = {}

  # Load the controller's module
  beforeEach ->
    module 'groupeat'
    module 'templates'

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()
      Authentication = $injector.get('Authentication')
      HttpProviderInterceptor = $injector.get('HttpProviderInterceptor')
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')
      ENV = $injector.get('ENV')

  afterEach ->
    $httpBackend.flush()
    sandbox.restore()

  it 'should be defined', ->
    HttpProviderInterceptor.should.be.defined

  it 'should add the accept headers', ->
    $httpBackend.when('GET', ENV.apiEndpoint, null, (headers) ->
      headers.Accept.should.equal('application/vnd.groupeat.v1+json')
    )

  it 'should have no authorization headers when the customer is not authorized', ->
    $httpBackend.when('GET', ENV.apiEndpoint, null, (headers) ->
      expect(headers.Authorization).to.be.undefined
    )

  it 'should have the token in the authorization headers when the customer is authorized', ->
    token = 'token'
    sandbox.stub(Authentication, 'getCredentials', ->
      token: token
    )
    $httpBackend.when('GET', ENV.apiEndpoint, null, (headers) ->
      expect(headers.Authorization).should.contain.token
    )
