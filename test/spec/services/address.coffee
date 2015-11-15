describe 'Service: Address', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.address'

  Address = scope = sandbox = $httpBackend = apiEndpoint = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()
      Address = $injector.get('Address')
      apiEndpoint = $injector.get('apiEndpoint')
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')

  afterEach ->
    sandbox.restore()

  describe 'Resource methods', ->

    it 'should have an update method', ->
      Address.should.have.property('update')

    it 'should return a fulfilled promise when the request returns a 200 status', ->
      response =
        data:
          longitude: 1
          latitude: 1
      regex = new RegExp('^'+apiEndpoint+'/customers/\\d+/address$')
      $httpBackend.whenPUT(regex).respond(response)
      Address.update('1', null).should.be.fulfilled
      $httpBackend.flush()

    it 'should reject a promise with an error message when the server responds with an error', ->
      regex = new RegExp('^'+apiEndpoint+'/customers/\\d+/address$')
      $httpBackend.whenPUT(regex).respond(404 , 'Error')
      Address.update('1', null).should.be.rejectedWith('invalidAddressErrorKey')
      $httpBackend.flush()

    it 'should have a get method', ->
      Address.should.have.property('get')

    it 'should return a fulfilled promise when the get request returns a 200 status', ->
      residency = 'ENSTAParisTech'
      details = 'details'
      data = []
      response =
        data:
          details: details
          street: 'Résidence ENSTA ParisTech, 828 Boulevard des Maréchaux'
      regex = new RegExp('^'+apiEndpoint+'/customers/\\d+/address$')
      $httpBackend.whenGET(regex).respond(response)
      Address.get(1).should.become({residency: residency, details: details})
      $httpBackend.flush()

    it 'should reject a promise when the server responds with an error to the get request', ->
      regex = new RegExp('^'+apiEndpoint+'/customers/\\d+/address$')
      $httpBackend.whenGET(regex).respond(404 , 'Error')
      Address.get(1).should.be.rejected
      $httpBackend.flush()

  describe 'Address#getAddressFromResidencyInformation', ->

    it 'should have a getAddressFromResidencyInformation method', ->
      Address.should.have.property('getAddressFromResidencyInformation')

    it 'should return the address of polytechnique when requested', ->
      Address.getAddressFromResidencyInformation('joffre').should.deep.equal
        street: 'Résidence Joffre (Polytechnique), 11 Boulevard des Maréchaux'
        latitude: 48.711109
        longitude: 2.210736

    it 'should return the address of fayolle when requested', ->
      address = Address.getAddressFromResidencyInformation('fayolle').should.deep.equal
        street: 'Résidence Fayolle (Polytechnique), 11 Boulevard des Maréchaux'
        latitude: 48.711109
        longitude: 2.210736

    it 'should return the address of ENSTA ParisTech when requested', ->
      address = Address.getAddressFromResidencyInformation('ENSTAParisTech').should.deep.equal
        street: 'Résidence ENSTA ParisTech, 828 Boulevard des Maréchaux'
        latitude: 48.7107339
        longitude: 2.2182327

    it 'should return undefined for other requests', ->
      expect(Address.getAddressFromResidencyInformation('residency')).to.be.undefined

  describe 'Address#getAddressFromResidencyInformation', ->

    it 'should return ENSTAParisTech if the coordinates match ENSTA residency', ->
      address =
        street: 'Résidence ENSTA ParisTech, 828 Boulevard des Maréchaux'
      Address.getResidencyInformationFromAddress(address).should.equal 'ENSTAParisTech'

    it 'should return joffre if the coordinates match Joffre residency', ->
      address =
        street: 'Résidence Joffre (Polytechnique), 11 Boulevard des Maréchaux'
      Address.getResidencyInformationFromAddress(address).should.equal 'joffre'

    it 'should return fayolle if the coordinates match Fayolle residency', ->
      address =
        street: 'Résidence Fayolle (Polytechnique), 11 Boulevard des Maréchaux'
      Address.getResidencyInformationFromAddress(address).should.equal 'fayolle'

    it 'should return undefined for other coordinates', ->
      address =
        street: 'Résidence Pollos Hermanos'
      expect(Address.getResidencyInformationFromAddress(address)).to.be.undefined

  describe 'Address#getResidencies', ->

    it 'should have a getResidencies method', ->
      Address.should.have.property 'getResidencies'

    it 'should return 7 residencies', ->
      Address.getResidencies().should.have.length 7
