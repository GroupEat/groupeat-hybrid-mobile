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

  describe 'Address#getAddressFromResidencyInformation', ->

    it 'should have a getAddressFromResidencyInformation method', ->
      Address.should.have.property('getAddressFromResidencyInformation')

    it 'the address should have street, latitude and longitude properties', ->
      address = Address.getAddressFromResidencyInformation('ENSTAParisTech')
      address.should.have.property('street')
      address.should.have.property('latitude')
      address.should.have.property('longitude')

    it 'the address street should be a non empty string', ->
      address = Address.getAddressFromResidencyInformation('ENSTAParisTech')
      address.street.should.be.a('string')
      address.street.should.not.be.empty

    it 'the latitude and longitude should be valid latitude and longitude', ->
      address = Address.getAddressFromResidencyInformation('ENSTAParisTech')
      address.latitude.should.be.within(-90, 90)
      address.longitude.should.be.within(-180, 180)

    it 'should return the address of ENSTA ParisTech', ->
      street = 'Boulevard des Maréchaux'
      latitude = 48.7107339
      longitude = 2.218232700000044
      address = Address.getAddressFromResidencyInformation('ENSTAParisTech')
      address.street.should.equal(street)
      address.latitude.should.equal(latitude)
      address.longitude.should.equal(longitude)
