describe 'Directive: geCampusEmail', ->

  beforeEach ->
    module 'groupeat'

  scope = form = httpBackend = {}

  beforeEach ->
    inject ($compile, $rootScope, $httpBackend) ->
      scope = $rootScope.$new()
      httpBackend = $httpBackend
      element = angular.element(
        '<form name="form">' +
        '<input ng-model="model.campusEmail" name="campusEmail" ge-campus-email />' +
        '</form>'
      )
      $compile(element)(scope)
      form = scope.form
      httpBackend.whenGET(/^templates\/.*/).respond('<html></html>')
      httpBackend.whenGET(/^translations\/.*/).respond('{}')


  it 'should pass with valid ENSTA emails', ->
    form.campusEmail.$setViewValue('test@ensta.fr')
    scope.$digest()
    expect(scope.model.campusEmail).to.equal('test@ensta.fr')
    expect(form.campusEmail.$valid).to.be.true
    form.campusEmail.$setViewValue('test@ensta-paristech.fr')
    scope.$digest()
    expect(scope.model.campusEmail).to.equal('test@ensta-paristech.fr')
    expect(form.campusEmail.$valid).to.be.true

  it 'should pass with valid Polytechnique emails', ->
    form.campusEmail.$setViewValue('test@polytechnique.edu')
    scope.$digest()
    expect(scope.model.campusEmail).to.equal('test@polytechnique.edu')
    expect(form.campusEmail.$valid).to.be.true


  it 'should pass with valid supoptique emails', ->
    form.campusEmail.$setViewValue('test@institutoptique.fr')
    scope.$digest()
    expect(scope.model.campusEmail).to.equal('test@institutoptique.fr')
    expect(form.campusEmail.$valid).to.be.true


  it 'should not pass with an invalid email', ->
    form.campusEmail.$setViewValue('invalidEmail')
    scope.$digest()
    expect(form.campusEmail.$valid).to.be.false


  it 'should not pass with an email not from campus', ->
    form.campusEmail.$setViewValue('test@gmail.com')
    scope.$digest()
    expect(form.campusEmail.$valid).to.be.false
