describe 'Service: MessageBackdrop', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.message-backdrop'
    module 'templates'

  $httpBackend = scope = sandbox = MessageBackdrop = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      MessageBackdrop = $injector.get('MessageBackdrop')

  afterEach ->
    sandbox.restore()

  describe 'MessageBackdrop#noBackdrop', ->

    it 'should return an object with a show property set to false', ->
      MessageBackdrop.noBackdrop().show.should.be.false

  describe 'MessageBackdrop#noNetwork', ->

    it 'should return an object with a show property set to true', ->
      MessageBackdrop.noNetwork().show.should.be.true

    it 'should return an object with title and details properties set to keys indicating lack of network', ->
      messageBackdrop = MessageBackdrop.noNetwork()
      messageBackdrop.title.should.equal('noNetworkTitle')
      messageBackdrop.details.should.equal('noNetworkDetails')

    it 'should return an object with a wifi icon class', ->
      messageBackdrop = MessageBackdrop.noNetwork()
      messageBackdrop.iconClasses.should.equal('ion-wifi')

    it 'should return an object with a button property having a default text and action', ->
      messageBackdrop = MessageBackdrop.noNetwork()
      messageBackdrop.button.text.should.equal('reload')
      messageBackdrop.button.action.should.equal('onReload()')

    it 'should override the button action if given as an argument', ->
      override = 'override()'
      messageBackdrop = MessageBackdrop.noNetwork(override)
      messageBackdrop.button.action.should.equal(override)

  describe 'MessageBackdrop#noGeolocation', ->

    it 'should return an object with a show property set to true', ->
      MessageBackdrop.noGeolocation().show.should.be.true

    it 'should return an object with title and details properties set to keys indicating lack of geolocation', ->
      messageBackdrop = MessageBackdrop.noGeolocation()
      messageBackdrop.title.should.equal('noGeolocationTitle')
      messageBackdrop.details.should.equal('noGeolocationDetails')

    it 'should return an object with a location icon class', ->
      messageBackdrop = MessageBackdrop.noGeolocation()
      messageBackdrop.iconClasses.should.equal('ion-location')

    it 'should return an object with a button property having a default text and action', ->
      messageBackdrop = MessageBackdrop.noGeolocation()
      messageBackdrop.button.text.should.equal('reload')
      messageBackdrop.button.action.should.equal('onReload()')

    it 'should override the button action if given as an argument', ->
      override = 'override()'
      messageBackdrop = MessageBackdrop.noGeolocation(override)
      messageBackdrop.button.action.should.equal(override)

  describe 'MessageBackdrop#genericFailure', ->

    it 'should return an object with a show property set to true', ->
      MessageBackdrop.genericFailure().show.should.be.true

    it 'should return an object with title and details properties set to keys indicating a generic failure', ->
      messageBackdrop = MessageBackdrop.genericFailure()
      messageBackdrop.title.should.equal('whoops')
      messageBackdrop.details.should.equal('genericFailureDetails')

    it 'should return an object with an alert icon class', ->
      messageBackdrop = MessageBackdrop.genericFailure()
      messageBackdrop.iconClasses.should.equal('ion-alert-circled')

    it 'should return an object with a button property having a default text and action', ->
      messageBackdrop = MessageBackdrop.genericFailure()
      messageBackdrop.button.text.should.equal('reload')
      messageBackdrop.button.action.should.equal('onReload()')

    it 'should override the button action if given as an argument', ->
      override = 'override()'
      messageBackdrop = MessageBackdrop.genericFailure(override)
      messageBackdrop.button.action.should.equal(override)
