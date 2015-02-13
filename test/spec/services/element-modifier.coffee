describe 'Service: ElementModifier', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.element-modifier'

  ElementModifier = scope = $httpBackend = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('<html></html>')
      ElementModifier = $injector.get('ElementModifier')

  describe 'Constructor', ->
    it 'should have an undefined errorMsg initially', ->
      expect(ElementModifier.errorMsg('form')).to.be.undefined

  describe "ElementModifier#makeInvalid", ->

    it 'should fetch an error message for the proper form when makeInvalid is called', ->
      form = angular.element('<form name="form"><input name="field"></form>')
      errorMsg = 'This field is invalid'
      ElementModifier.makeInvalid(form.find('input'), errorMsg)
      expect(ElementModifier.errorMsg('form')).to.equal(errorMsg)

    it 'should fetch an error message for the proper form when makeInvalid is called after makeValid was called', ->
      form = angular.element('<form name="form"><input name="field"></form>')
      errorMsg = 'This field is invalid'
      ElementModifier.makeValid(form.find('input'))
      ElementModifier.makeInvalid(form.find('input'), errorMsg)
      expect(ElementModifier.errorMsg('form')).to.equal(errorMsg)

    it 'should not fetch an error message for a form on which makeInvalid was not called', ->
      form = angular.element('<form name="form"><input name="field"></form>')
      errorMsg = 'This field is invalid'
      ElementModifier.makeInvalid(form.find('input'), errorMsg)
      expect(ElementModifier.errorMsg('otherForm')).to.be.undefined

    it 'should fetch the first error message when makeInvalid is called for several fields', ->
      form = angular.element('<form name="form"><input name="field"><input name="otherField"></form>')
      inputs = form.find('input')
      errorMsg = 'This field is invalid'
      otherErrorMsg = 'This other field is invalid'
      ElementModifier.makeInvalid(angular.element(inputs[0]), errorMsg)
      ElementModifier.makeInvalid(angular.element(inputs[1]), otherErrorMsg)
      expect(ElementModifier.errorMsg('form')).to.equal(errorMsg)

  describe "ElementModifier#makeValid", ->

    it 'should return an undefined error message when the form is made valid', ->
      form = angular.element('<form name="form"><input name="field"></form>')
      ElementModifier.makeValid(form.find('input'))
      expect(ElementModifier.errorMsg('form')).to.be.undefined

    it 'should return an undefined error message when the form is made valid after it was made invalid', ->
      form = angular.element('<form name="form"><input name="field"></form>')
      ElementModifier.makeInvalid(form.find('input'), 'This field is invalid')
      ElementModifier.makeValid(form.find('input'))
      expect(ElementModifier.errorMsg('form')).to.be.undefined

  describe "ElementModifier#makeDefault", ->

    it 'should return an undefined error message when the form is made valid', ->
      form = angular.element('<form name="form"><input name="field"></form>')
      ElementModifier.makeDefault(form.find('input'))
      expect(ElementModifier.errorMsg('form')).to.be.undefined

    it 'should return an undefined error message when the form is made valid after it was made invalid', ->
      form = angular.element('<form name="form"><input name="field"></form>')
      ElementModifier.makeInvalid(form.find('input'), 'This field is invalid')
      ElementModifier.makeDefault(form.find('input'))
      expect(ElementModifier.errorMsg('form')).to.be.undefined

  describe 'ElementModifier#errorKeyFromBackend', ->

    it 'should return undefined if the response from the server is undefined', ->
      expect(ElementModifier.errorKeyFromBackend(undefined)).to.be.undefined

    it 'should return undefined if the response from the server has no data property', ->
      response =
        notData: 'oops'
      expect(ElementModifier.errorKeyFromBackend(response)).to.be.undefined

    it 'should return undefined if the response from the server has a data property with no errors property', ->
      response =
        data:
          notErrors: 'oops'
      expect(ElementModifier.errorKeyFromBackend(response)).to.be.undefined

    it 'should return undefined if the response.data.errors is not an object', ->
      response =
        data:
          errors: 'error'
      expect(ElementModifier.errorKeyFromBackend(response)).to.be.undefined

    it 'should return undefined if the response.data.errors is null', ->
      response =
        data:
          errors: null
      expect(ElementModifier.errorKeyFromBackend(response)).to.be.undefined

    it 'should return undefined if all keys of the response.data.errors are not objects', ->
      response =
        data:
          errors:
            field: 'notAnObject'
            otherField: null
      expect(ElementModifier.errorKeyFromBackend(response)).to.be.undefined

  describe 'ElementModifier#errorMsgFromBackend', ->

    it 'should return undefined if the response from the server is undefined', ->
      expect(ElementModifier.errorMsgFromBackend(undefined)).to.be.undefined

    it 'should return undefined if the response from the server has no data property', ->
      response =
        notData: 'oops'
      expect(ElementModifier.errorMsgFromBackend(response)).to.be.undefined

    it 'should return undefined if the response from the server has a data property with no errors property', ->
      response =
        data:
          notErrors: 'oops'
      expect(ElementModifier.errorMsgFromBackend(response)).to.be.undefined
