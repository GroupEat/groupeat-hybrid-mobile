describe 'Service: _', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat'

  _ = scope = $httpBackend = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^templates\/.*/).respond('<html></html>')
      $httpBackend.whenGET(/^translations\/.*/).respond('<html></html>')
      _ = $injector.get('_')

  it 'Lodash service should equal html window._', ->
    expect(_).to.equal(window._)
