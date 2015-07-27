describe 'Service: MessageBackdrop', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.message-backdrop'

  sandbox = MessageBackdrop = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($injector) ->
      sandbox = sinon.sandbox.create()
      MessageBackdrop = $injector.get('MessageBackdrop')

  afterEach ->
    sandbox.restore()

  describe "MessageBackdrop#backdropFromErrorKey('noNetwork')", ->

    it 'should return an object with title and details properties set to keys indicating lack of network', ->
      messageBackdrop = MessageBackdrop.backdropFromErrorKey('noNetwork')
      messageBackdrop.title.should.equal('noNetwork')
      messageBackdrop.details.should.equal('noNetworkDetails')

    it 'should return an object with a wifi icon class', ->
      messageBackdrop = MessageBackdrop.backdropFromErrorKey('noNetwork')
      messageBackdrop.icon.should.equal('ion-wifi')

    it 'should return an object with a button property having a default text and action', ->
      messageBackdrop = MessageBackdrop.backdropFromErrorKey('noNetwork')
      messageBackdrop.buttonText.should.equal('reload')
      messageBackdrop.buttonSref.should.be.empty

  describe "MessageBackdrop#backdropFromErrorKey('noGeolocation')", ->

    it 'should return an object with title and details properties set to keys indicating lack of geolocation', ->
      messageBackdrop = MessageBackdrop.backdropFromErrorKey('noGeolocation')
      messageBackdrop.title.should.equal('noGeolocation')
      messageBackdrop.details.should.equal('noGeolocationDetails')

    it 'should return an object with a location icon class', ->
      messageBackdrop = MessageBackdrop.backdropFromErrorKey('noGeolocation')
      messageBackdrop.icon.should.equal('ion-location')

    it 'should return an object with a button property having a default text and action', ->
      messageBackdrop = MessageBackdrop.backdropFromErrorKey('noGeolocation')
      messageBackdrop.buttonText.should.equal('reload')
      messageBackdrop.buttonSref.should.be.empty

  describe 'MessageBackdrop#backdropFromErrorKey', ->

    it 'should return an object with a status property set to \'displayed\'', ->
      MessageBackdrop.backdropFromErrorKey().status.should.equal 'displayed'

    it 'should return an object with title and details properties set to keys indicating a generic failure', ->
      messageBackdrop = MessageBackdrop.backdropFromErrorKey()
      messageBackdrop.title.should.equal('genericFailure')
      messageBackdrop.details.should.equal('genericFailureDetails')

    it 'should return an object with an alert icon class', ->
      messageBackdrop = MessageBackdrop.backdropFromErrorKey()
      messageBackdrop.icon.should.equal('ion-alert-circled')

    it 'should return an object with a button property having a default text and action', ->
      messageBackdrop = MessageBackdrop.backdropFromErrorKey()
      messageBackdrop.buttonText.should.equal('reload')
      messageBackdrop.buttonSref.should.be.empty
