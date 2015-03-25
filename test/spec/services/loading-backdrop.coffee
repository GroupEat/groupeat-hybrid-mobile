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

    it 'should return an object with a default class if none is given in the first argument', ->
      LoadingBackdrop.backdrop().class.should.equal('total-backdrop')

    it 'should return an object with the given class given in the first argument', ->
      backdropClass = 'backdropClass'
      LoadingBackdrop.backdrop(backdropClass).class.should.equal(backdropClass)

    it 'should return an object with a default circular property if none is given in the second argument', ->
      LoadingBackdrop.backdrop(null).circular.should.equal('classical')

    it 'should return an object with the given circular property given in the second argument', ->
      circularClass = 'circularClass'
      LoadingBackdrop.backdrop(null, circularClass).circular.should.equal(circularClass)
