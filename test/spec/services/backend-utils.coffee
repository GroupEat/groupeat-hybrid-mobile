describe 'Service: BackendUtils', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.backend-utils'

  BackendUtils = scope = $httpBackend = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('<html></html>')
      BackendUtils = $injector.get('BackendUtils')

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

    it 'should return undefined if the response from the server has a data property with no errors property', ->
      response =
        data:
          data:
            notErrors: 'oops'
      expect(BackendUtils.errorKeyFromBackend(response)).to.be.undefined

    it 'should return undefined if the response.data.errors is not an object', ->
      response =
        data:
          data:
            errors: 'error'
      expect(BackendUtils.errorKeyFromBackend(response)).to.be.undefined

    it 'should return undefined if the response.data.errors is null', ->
      response =
        data:
          data:
            errors: null
      expect(BackendUtils.errorKeyFromBackend(response)).to.be.undefined

    it 'should return undefined if none of the keys of the response.data.errors are objects', ->
      response =
        data:
          data:
            errors:
              field: 'notAnObject'
              otherField: null
      expect(BackendUtils.errorKeyFromBackend(response)).to.be.undefined

    it 'should return the first validation key whose value is an array of the first field whose value is a non null object of response.data.errors', ->
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

    it 'should return undefined if the response from the server has a data property with no errors property', ->
      response =
        data:
          data:
            notErrors: 'oops'
      expect(BackendUtils.errorMsgFromBackend(response)).to.be.undefined

    it 'should return undefined if none of the keys of the response.data.errors are objects', ->
      response =
        data:
          data:
            errors:
              field: 'notAnObject'
              otherField: null
      expect(BackendUtils.errorMsgFromBackend(response)).to.be.undefined

    it 'should return the first validation key (concatenated with ErrorKey) whose value is an array of the first field whose value is a non null object of response.data.errors', ->
      response =
        data:
          data:
            errors:
              field: 'notAnObject'
              otherField:
                firstValidationKey: 'notAnArray'
                validationKey: []
      expect(BackendUtils.errorMsgFromBackend(response)).to.equal('validationKeyErrorKey')

    it 'should properly insert an additional value in the validation key (concatenated with ErrorKey) when relevant', ->
      response = {
        'data': {
          'data': {
            'errors': {
              'password': {
                'min%s': [
                  6
                ]
              }
            }
          }
        }
      }
      expect(BackendUtils.errorMsgFromBackend(response)).to.equal('min6ErrorKey')
