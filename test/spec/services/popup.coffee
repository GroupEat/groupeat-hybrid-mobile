describe 'Service: Popup', ->

  # Load the service's module
  beforeEach ->
    module 'groupeat.services.popup'

  $ionicPopup = $q = sandbox = scope = Popup = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()
      Popup = $injector.get('Popup')
      $ionicPopup = $injector.get('$ionicPopup')
      $q = $injector.get('$q')

  afterEach ->
    sandbox.restore()

  describe 'Popup#alert', ->

    it 'should open a $ionicPopup with the given title and template', ->
      sandbox.stub($ionicPopup, 'alert')
      title = 'Title'
      template = '<strong>content</strong>'
      Popup.alert(title, template)
      scope.$digest()
      $ionicPopup.alert.should.have.been.calledWithExactly
        title: title
        template: template

    it 'should be resolved when $ionicPopup.alert is resolved', ->
      res = 'res'
      sandbox.stub $ionicPopup, 'alert', () ->
        deferred = $q.defer()
        deferred.resolve(res)
        deferred.promise
      Popup.alert('Title', 'template').should.become res
      scope.$digest()

  describe 'Popup#confirm', ->

    it 'should open a $ionicPopup confirm with the given title and template', ->
      sandbox.stub($ionicPopup, 'confirm')
      title = 'Title'
      template = '<strong>content</strong>'
      Popup.confirm(title, template)
      scope.$digest()
      $ionicPopup.confirm.should.have.been.calledWithExactly
        title: title
        template: template
        okText: 'OK'
        cancelText: 'cancel'

    it 'should open a $ionicPopup confirm with the given okText and cancelText if provided', ->
      sandbox.stub($ionicPopup, 'confirm')
      title = 'Title'
      template = '<strong>content</strong>'
      okText = 'Okidoki'
      cancelText = 'Really cancel'
      Popup.confirm(title, template, okText, cancelText)
      scope.$digest()
      $ionicPopup.confirm.should.have.been.calledWithExactly
        title: title
        template: template
        okText: okText
        cancelText: cancelText

    it 'should be resolved when $ionicPopup.alert is resolved', ->
      res = 'res'
      sandbox.stub $ionicPopup, 'confirm', () ->
        deferred = $q.defer()
        deferred.resolve(res)
        deferred.promise
      Popup.confirm('Title', 'template').should.become res
      scope.$digest()

  describe 'Popup#error', ->

    it 'should open a $ionicPopup with whoops as a title and the given error message', ->
      sandbox.stub($ionicPopup, 'alert')
      errorMessage = 'An error message'
      Popup.error(errorMessage)
      scope.$digest()
      $ionicPopup.alert.should.have.been.calledWithExactly
        title: 'whoops'
        template: errorMessage

  describe 'Popup#title', ->

    it 'should open a $ionicPopup with the given title and no content', ->
      sandbox.stub($ionicPopup, 'alert')
      title = 'Title'
      Popup.title(title)
      scope.$digest()
      $ionicPopup.alert.should.have.been.calledWithExactly
        title: title
        template: ''
