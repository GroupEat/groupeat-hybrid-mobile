describe 'Service: LoadingBackdrop', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.loading-backdrop'
    module 'templates'

  $httpBackend = scope = sandbox = LoadingBackdrop = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      LoadingBackdrop = $injector.get('LoadingBackdrop')

  afterEach ->
    sandbox.restore()

  describe 'LoadingBackdrop#noBackdrop', ->

    it 'should return an object with a show property set to false', ->
      LoadingBackdrop.noBackdrop().show.should.be.false

  describe 'LoadingBackdrop#backdrop', ->

    it 'should return an object with a show property set to true', ->
      LoadingBackdrop.backdrop().show.should.be.true

