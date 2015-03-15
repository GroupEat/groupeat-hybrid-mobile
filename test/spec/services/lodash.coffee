describe 'Service: _', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.lodash'
    module 'templates'

  _ = scope = $httpBackend = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')
      _ = $injector.get('_')

  it 'Lodash service should equal html window._', ->
    expect(_).to.equal(window._)
