describe 'Service: Popup', ->

  # Load the service's module
  beforeEach ->
    module 'groupeat.services.popup'

  Popup = $mdDialog = scope = sandbox = body = dialogContainer = $timeout = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()
      Popup = $injector.get('Popup')
      $mdDialog = $injector.get('$mdDialog')
      sandbox.spy($mdDialog, 'hide')
      $timeout = $injector.get('$timeout')

  cleanDialog = ->
    body = angular.element(document.body)
    dialogContainer = body[0].querySelector('.md-dialog-container')
    dialogElement = angular.element(dialogContainer)
    dialogElement.remove()
    scope.$digest()

  beforeEach ->
    cleanDialog()

  afterEach ->
    sandbox.restore()
    cleanDialog()

  describe 'Popup#displayError', ->

    it 'should open a dialog', ->
      Popup.displayError('An error message', false)
      scope.$apply()
      dialogContainer = body[0].querySelector('.md-dialog-container')
      expect(dialogContainer).to.be.not.null

    it 'the dialog should have whoops as title', ->
      Popup.displayError('An error message', false)
      scope.$apply()
      dialogContainer = body[0].querySelector('.md-dialog-container')
      title = angular.element(dialogContainer.querySelector('h2'))
      title.text().should.equal('whoops')

    it 'the dialog should contain the given errorMessage as its content', ->
      errorMessage = 'An error message'
      Popup.displayError(errorMessage, false)
      scope.$apply()
      dialogContainer = body[0].querySelector('.md-dialog-container')
      content = angular.element(dialogContainer.querySelector('p'))
      content.text().should.equal(errorMessage)

    it 'the dialog should have a single ok button', ->
      Popup.displayError('An error message', false)
      scope.$apply()
      dialogContainer = body[0].querySelector('.md-dialog-container')
      buttons = angular.element(dialogContainer.querySelector('button'))
      buttons.length.should.equal(1)
      buttons.eq(0).text().should.equal('ok')

    it 'the dialog should disappear when given a timeout after its period', ->
      Popup.displayError('An error message', 1000)
      scope.$apply()
      $mdDialog.hide.should.not.have.been.called
      $timeout.flush(100)
      $mdDialog.hide.should.not.have.been.called
      $timeout.flush(900)
      $mdDialog.hide.should.have.been.called

  describe 'Popup#displayTitleOnly', ->

    it 'should open a dialog', ->
      dialogContainer = body[0].querySelector('.md-dialog-container')
      expect(dialogContainer).to.be.null
      Popup.displayTitleOnly('Title', false)
      scope.$apply()
      dialogContainer = body[0].querySelector('.md-dialog-container')
      expect(dialogContainer).to.be.not.null

    it 'the dialog should contain the given title as its title', ->
      expectedTitle = 'Title'
      Popup.displayTitleOnly(expectedTitle, false)
      scope.$apply()
      dialogContainer = body[0].querySelector('.md-dialog-container')
      title = angular.element(dialogContainer.querySelector('h2'))
      title.text().should.equal(expectedTitle)

    it 'the dialog should have a single ok button', ->
      Popup.displayTitleOnly('Title', false)
      scope.$apply()
      dialogContainer = body[0].querySelector('.md-dialog-container')
      buttons = angular.element(dialogContainer.querySelector('button'))
      buttons.length.should.equal(1)
      buttons.eq(0).text().should.equal('ok')

    it 'the dialog should disappear when given a timeout after its period', ->
      Popup.displayTitleOnly('Title', 1000)
      scope.$apply()
      $mdDialog.hide.should.not.have.been.called
      $timeout.flush(100)
      $mdDialog.hide.should.not.have.been.called
      $timeout.flush(900)
      $mdDialog.hide.should.have.been.called
