describe 'Service: Address', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.address'

  Address = scope = sandbox = $httpBackend = ENV = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()
      Address = $injector.get('Address')
      ENV = $injector.get('ENV')
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')

  afterEach ->
    sandbox.restore()

  describe 'Resource methods', ->

    it 'should have an update method', ->
      Address.should.have.property('update')

    it 'should return a fulfilled promise when the request returns a 200 status', ->
      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+/address$')
      $httpBackend.whenPUT(regex).respond(200 , 'Success')
      Address.update({id: 1}, null).should.be.fulfilled
      $httpBackend.flush()

    it 'should reject a promise with an error message when the server responds with an error', ->
      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+/address$')
      $httpBackend.whenPUT(regex).respond(404 , 'Error')
      Address.update({id: 1}, null).should.be.rejectedWith('invalidAddressErrorKey')
      $httpBackend.flush()

    it 'should have a get method', ->
      Address.should.have.property('get')

    it 'should return a fulfilled promise when the get request returns a 200 status', ->
      data = []
      response =
        data:
          data
      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+/address$')
      $httpBackend.whenGET(regex).respond(response)
      Address.get(1).should.become(data)
      $httpBackend.flush()

    it 'should reject a promise when the server responds with an error to the get request', ->
      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+/address$')
      $httpBackend.whenGET(regex).respond(404 , 'Error')
      Address.get(1).should.be.rejected
      $httpBackend.flush()

  describe 'Address#getAddressFromResidencyInformation', ->

    it 'should have a getAddressFromResidencyInformation method', ->
      Address.should.have.property('getAddressFromResidencyInformation')

    it 'the address should have street, latitude and longitude properties', ->
      address = Address.getAddressFromResidencyInformation('residency')
      address.should.have.property('street')
      address.should.have.property('latitude')
      address.should.have.property('longitude')

    it 'the address street should be a non empty string', ->
      address = Address.getAddressFromResidencyInformation('residency')
      address.street.should.be.a('string')
      address.street.should.not.be.empty

    it 'the latitude and longitude should be valid latitude and longitude', ->
      address = Address.getAddressFromResidencyInformation('residency')
      address.latitude.should.be.within(-90, 90)
      address.longitude.should.be.within(-180, 180)

    it 'should return the address of polytechnique when requested', ->
      street = 'Boulevard des Maréchaux'
      latitude = 48.709862
      longitude = 2.210241
      address = Address.getAddressFromResidencyInformation('polytechnique')
      address.street.should.equal(street)
      address.latitude.should.equal(latitude)
      address.longitude.should.equal(longitude)

    it 'should return the address of supoptique when requested', ->
      street = '2 Avenue Augustin Fresnel'
      latitude = 48.714258
      longitude = 2.203553
      address = Address.getAddressFromResidencyInformation('supoptique')
      address.street.should.equal(street)
      address.latitude.should.equal(latitude)
      address.longitude.should.equal(longitude)

    it 'should return the address of ENSTA ParisTech otherwise', ->
      street = 'Boulevard des Maréchaux'
      latitude = 48.7107339
      longitude = 2.218232700000044
      address = Address.getAddressFromResidencyInformation('residency')
      address.street.should.equal(street)
      address.latitude.should.equal(latitude)
      address.longitude.should.equal(longitude)

  describe 'Address#getAddressFromResidencyInformation', ->

    it 'should return polytechnique if the coordinates match polytechnique residency', ->
      address =
        latitude: 48.709862
        longitude: 2.210241
      Address.getResidencyInformationFromAddress(address).should.equal('polytechnique')

    it 'should return supoptique if the coordinates match supoptique residency', ->
      address =
        latitude: 48.714258
        longitude: 2.203553
      Address.getResidencyInformationFromAddress(address).should.equal('supoptique')

    it 'should return ENSTAParisTech in other cases', ->
      address = {}
      Address.getResidencyInformationFromAddress(address).should.equal('ENSTAParisTech')

  describe 'Address#getResidencies', ->

    it 'should have a getResidencies method', ->
      Address.should.have.property('getResidencies')

    it 'should return 3 residencies', ->
      Address.getResidencies().should.have.length(3)
