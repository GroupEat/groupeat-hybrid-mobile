describe 'Service: Push', ->

  beforeEach ->
    module 'groupeat'

  Push = scope = $httpBackend = {}

  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      Push = $injector.get('Push')
