describe 'Service: Authentication', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat'

  Authentication = scope = sandbox = localStorageService = mockLocalStorage = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()
      Authentication = $injector.get('Authentication')
      localStorageService = $injector.get('localStorageService')
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
    mockLocalStorage = {}
    sandbox.restore()

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
