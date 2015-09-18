describe 'Service: BackendUtils', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.backend-utils'

  BackendUtils = scope = $httpBackend = Credentials = $state = sandbox = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()
      $state = $injector.get('$state')
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('<html></html>')
      BackendUtils = $injector.get('BackendUtils')
      Credentials = $injector.get('Credentials')

  afterEach ->
    sandbox.restore()

  describe 'BackendUtils#errorKeyFromBackend', ->

    it 'should return undefined if the response from the server is undefined', ->
      expect(BackendUtils.errorKeyFromBackend(undefined)).to.be.undefined

    it 'should return undefined if the response from the server has no data property', ->
      response =
        notData: 'oops'
      expect(BackendUtils.errorKeyFromBackend(response)).to.be.undefined

    it 'should return undefined if the response.data from the server has no data property', ->
      response =
        data:
          notData: 'oops'
      expect(BackendUtils.errorKeyFromBackend(response)).to.be.undefined

    it 'should return undefined if the response.data from the server has a data property with no errors or errorKey property', ->
      response =
        data:
          data:
            notErrors: 'oops'
      expect(BackendUtils.errorKeyFromBackend(response)).to.be.undefined

    it 'should return the errorKey if the response.data.data has an errorKey property', ->
      response =
        data:
          data:
            errorKey: 'validationKey'
      BackendUtils.errorKeyFromBackend(response).should.equal('validationKey')

    it 'should call Credentials.set and change the state if the response.data.data has an errorKey equal to noUserForAuthenticationToken', ->
      response =
        data:
          data:
            errorKey: 'noUserForAuthenticationToken'
      sandbox.spy(Credentials, 'reset')
      sandbox.stub($state, 'go')
      BackendUtils.errorKeyFromBackend(response)
      Credentials.reset.should.be.called.once
      $state.go.should.be.called.once

    it 'should call Credentials.set and change the state if the response.data.data has an errorKey equal to userMustAuthenticate', ->
      response =
        data:
          data:
            errorKey: 'userMustAuthenticate'
      sandbox.spy(Credentials, 'reset')
      sandbox.stub($state, 'go')
      BackendUtils.errorKeyFromBackend(response)
      Credentials.reset.should.be.called.once
      $state.go.should.be.called.once

    it 'should return undefined if the response.data.data.errors is not an object', ->
      response =
        data:
          data:
            errors: 'error'
      expect(BackendUtils.errorKeyFromBackend(response)).to.be.undefined

    it 'should return undefined if the response.data.data.errors is null', ->
      response =
        data:
          data:
            errors: null
      expect(BackendUtils.errorKeyFromBackend(response)).to.be.undefined

    it 'should return undefined if none of the keys of the response.data.data.errors are objects', ->
      response =
        data:
          data:
            errors:
              field: 'notAnObject'
              otherField: null
      expect(BackendUtils.errorKeyFromBackend(response)).to.be.undefined

    it 'should return the first validation key whose value is an array of the first field whose value is a non null object of response.data.data.errors', ->
      response =
        data:
          data:
            errors:
              field: 'notAnObject'
              otherField:
                firstValidationKey: 'notAnArray'
                validationKey: []
      expect(BackendUtils.errorKeyFromBackend(response)).to.equal('validationKey')

  describe 'BackendUtils#errorMsgFromBackend', ->

    it 'should return undefined if the response from the server is undefined', ->
      expect(BackendUtils.errorMsgFromBackend(undefined)).to.be.undefined

    it 'should return undefined if the response from the server has no data property', ->
      response =
        notData: 'oops'
      expect(BackendUtils.errorMsgFromBackend(response)).to.be.undefined

    it 'should return undefined if the response.data from the server has no data property', ->
      response =
        data:
          notData: 'oops'
      expect(BackendUtils.errorMsgFromBackend(response)).to.be.undefined

    it 'should return undefined if the response.data from the server has a data property with no errors or errorKey property', ->
      response =
        data:
          data:
            notErrors: 'oops'
      expect(BackendUtils.errorMsgFromBackend(response)).to.be.undefined

    it 'should return the genericFailureDetails if the response.data.data has an errorKey property which is not translated', ->
      response =
        data:
          data:
            errorKey: 'validationKey'
      BackendUtils.errorMsgFromBackend(response).should.equal('genericFailureDetails')

    it 'should call Credentials.set and change the state if the response.data.data has an errorKey equal to noUserForAuthenticationToken', ->
      response =
        data:
          data:
            errorKey: 'noUserForAuthenticationToken'
      sandbox.spy(Credentials, 'reset')
      sandbox.stub($state, 'go')
      BackendUtils.errorMsgFromBackend(response)
      Credentials.reset.should.be.called.once
      $state.go.should.be.called.once

    it 'should call Credentials.set and change the state if the response.data.data has an errorKey equal to userMustAuthenticate', ->
      response =
        data:
          data:
            errorKey: 'userMustAuthenticate'
      sandbox.spy(Credentials, 'reset')
      sandbox.stub($state, 'go')
      BackendUtils.errorMsgFromBackend(response)
      Credentials.reset.should.be.called.once
      $state.go.should.be.called.once

    it 'should return undefined if none of the keys of the response.data.data.errors are objects', ->
      response =
        data:
          data:
            errors:
              field: 'notAnObject'
              otherField: null
      expect(BackendUtils.errorMsgFromBackend(response)).to.be.undefined
