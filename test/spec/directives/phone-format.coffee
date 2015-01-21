describe 'Directive: gePhoneFormat', ->

  beforeEach ->
    module 'groupeat'

  scope = form = $httpBackend = {}

  beforeEach ->
    inject ($compile, $rootScope, $injector) ->
      scope = $rootScope.$new()
      element = angular.element(
        '<form name="form">' +
        '<input ng-model="model.phoneFormat" name="phoneFormat" ge-phone-format />' +
        '</form>'
      )
      $compile(element)(scope)
      form = scope.form
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^templates\/.*/).respond('<html></html>')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')


  it 'should pass with valid phone formats', ->

    form.phoneFormat.$setViewValue('0623456798')
    scope.$digest()
    expect(scope.model.phoneFormat).to.equal('0623456798')
    expect(form.phoneFormat.$valid).to.be.true

    form.phoneFormat.$setViewValue('07 23 45 67 98')
    scope.$digest()
    expect(scope.model.phoneFormat).to.equal('07 23 45 67 98')
    expect(form.phoneFormat.$valid).to.be.true

    form.phoneFormat.$setViewValue('01-23-45-67-98')
    scope.$digest()
    expect(scope.model.phoneFormat).to.equal('01-23-45-67-98')
    expect(form.phoneFormat.$valid).to.be.true
    

  it 'should not pass with an invalid phone format', ->

    form.phoneFormat.$setViewValue('notAPhoneNumber')
    scope.$digest()
    expect(form.phoneFormat.$valid).to.be.false

    form.phoneFormat.$setViewValue('007isNotAPhoneNumber')
    scope.$digest()
    expect(form.phoneFormat.$valid).to.be.false

    form.phoneFormat.$setViewValue('063745095')
    scope.$digest()
    expect(form.phoneFormat.$valid).to.be.false
