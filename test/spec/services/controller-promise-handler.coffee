describe 'Service: ControllerPromiseHandler', ->

  beforeEach ->
    module 'groupeat.services.controller-promise-handler'

  beforeEach ->
    module 'ui.router', ($provide) ->
      $provide.provider '$state', ->
        $get: ->
          current:
            name: 'initial'
      return

  $q = $state = ControllerPromiseHandler = rootScope = sandbox = scope = {}

  beforeEach ->
    inject ($rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()
      $q = $injector.get '$q'
      $state = $injector.get '$state'
      ControllerPromiseHandler = $injector.get 'ControllerPromiseHandler'
      rootScope = $rootScope

  afterEach ->
    sandbox.restore()

  describe 'ControllerPromiseHandler.handle', ->

    it 'should call $rootScope.$broadcast with hideMesageBackdrop if the given promise is resolved and the current state name equals the initial state of the controller', ->
      sandbox.spy rootScope, '$broadcast'
      promise = $q.when({})
      ControllerPromiseHandler.handle promise, 'initial'
      scope.$digest()
      rootScope.$broadcast.should.have.been.calledWithExactly 'hideMessageBackdrop'

    it 'should not call $rootScope.$broadcast if the given promise is resolved and the current state name differs from the initial state of the controller', ->
      sandbox.spy rootScope, '$broadcast'
      promise = $q.when({})
      ControllerPromiseHandler.handle promise, 'other'
      scope.$digest()
      rootScope.$broadcast.should.not.have.been.called

    it 'should call $rootScope.$broadcast with displayMessageBackdrop and the rejected error key if the given promise is rejected and the current state name equals the initial state of the controller', ->
      sandbox.spy rootScope, '$broadcast'
      errorKey = 'errorKey'
      promise = $q.reject errorKey
      ControllerPromiseHandler.handle promise, 'initial'
      scope.$digest()
      rootScope.$broadcast.should.have.been.calledWithExactly 'displayMessageBackdrop', errorKey

    it 'should not call $rootScope.$broadcast if the given promise is rejected and the current state name differs from the initial state of the controller', ->
      sandbox.spy rootScope, '$broadcast'
      promise = $q.reject()
      ControllerPromiseHandler.handle promise, 'other'
      scope.$digest()
      rootScope.$broadcast.should.not.have.been.called
