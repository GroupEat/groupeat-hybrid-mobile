describe 'Service: ErrorMessageResolver', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat'

  ErrorMessageResolver = scope = $httpBackend = $q = $timeout = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      $q = $injector.get('$q')
      $timeout = $injector.get('$timeout')
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^templates\/.*/).respond('<html></html>')
      $httpBackend.whenGET(/^translations\/.*/).respond('<html></html>')
      ErrorMessageResolver = $injector.get('ErrorMessageResolver')

  describe "ErrorMessageResolver#formatErrorMessage", ->

    it 'should leave the error message intact when el is not an angular element', ->
      errorType = 'required'
      el = '<input>'
      errorMessage = 'This field is required'
      ErrorMessageResolver.formatErrorMessage(errorType, el, errorMessage).should.equal(errorMessage)

    it 'should leave the error message intact when the string does not include a placeholder', ->
      errorType = 'required'
      el = angular.element('<input required>')
      errorMessage = 'This field is required'
      ErrorMessageResolver.formatErrorMessage(errorType, el, errorMessage).should.equal(errorMessage)

    it 'should format an error message when the field has an validation attribute value', ->
      errorType = 'minlength'
      el = angular.element('<input ng-minlength="6">')
      errorMessage = 'This field should have at least %s characters'
      formattedErrorMessage = 'This field should have at least 6 characters'
      ErrorMessageResolver.formatErrorMessage(errorType, el, errorMessage).should.equal(formattedErrorMessage)

    it 'should throw an exception when the minlength or maxlength attribute value is missing', ->
      errorType = 'minlength'
      el = angular.element('<input ng-minlength>')
      errorMessage = 'This field should have at least %s characters'
      expect(-> ErrorMessageResolver.formatErrorMessage(errorType, el, errorMessage)).to.throw(Error, 'missingMandatoryAttributeValueError')

    it 'should throw an exception when the minlength or maxlength attribute value is not an integer', ->
      errorType = 'minlength'
      el = angular.element('<input ng-minlength="wa">')
      errorMessage = 'This field should have at least %s characters'
      expect(-> ErrorMessageResolver.formatErrorMessage(errorType, el, errorMessage)).to.throw(Error, 'invalidMandatoryAttributeValueTypeError')

  describe "ErrorMessageResolver#resolve", ->

    it 'should return the error message for an error type', ->
      errorType = 'required'
      el = angular.element('<input name="requiredField">')
      ErrorMessageResolver.resolve(errorType, el).should.eventually.equal('requiredErrorKey')
      # For some reason, this does not work in afterEach
      scope.$apply()

    it 'should throw an exception when the name attribute is missing from a field', ->
      errorType = 'required'
      el = angular.element('<input>')
      ErrorMessageResolver.resolve(errorType, el).should.be.rejectedWith(Error, 'missingFieldNameError')
      # For some reason, this does not work in afterEach
      scope.$apply()
