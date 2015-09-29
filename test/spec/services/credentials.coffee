describe 'Service: Credentials', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.credentials'
    module 'templates'

  $httpBackend = Credentials = scope = sandbox = localStorageService = $state = mockLocalStorage = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      Credentials = $injector.get('Credentials')
      localStorageService = $injector.get('localStorageService')
      $state = $injector.get('$state')
      sandbox.stub(localStorageService, 'get', (key) ->
        return mockLocalStorage[key]
      )
      sandbox.stub(localStorageService, 'set', (key, value) ->
        mockLocalStorage[key] = value
      )
      sandbox.stub(localStorageService, 'remove', (key) ->
        delete mockLocalStorage[key]
      )
      sandbox.stub($state, 'go')

  afterEach ->
    sandbox.restore()
    mockLocalStorage = {}

  it 'should initially return undefined when getting the customer credentials', ->
    Credentials.get()
    $state.go.should.have.been.called.with.calledWithExactly('app.authentication')
    expect(Credentials.get()).to.be.undefined

  it 'should return credentials when they were previously set', ->
    id = 1
    token = 'token'
    Credentials.set(id, token)
    Credentials.get().id.should.equal(id)
    Credentials.get().token.should.equal(token)

  it 'should return undefined when they were previously set but reset afterwards', ->
    id = 1
    token = 'token'
    Credentials.set(id, token)
    Credentials.reset()
    expect(Credentials.get()).to.be.undefined

  it 'should return undefined when there is just a token stored in local storage', ->
    localStorageService.set('token', 'token')
    expect(Credentials.get()).to.be.undefined

  it 'should return undefined when there is just an id stored in local storage', ->
    localStorageService.set('id', 1)
    expect(Credentials.get()).to.be.undefined
