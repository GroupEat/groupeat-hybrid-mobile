describe 'Service: ResidencyUtils', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat'

  ResidencyUtils = scope = $httpBackend = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^templates\/.*/).respond('<html></html>')
      $httpBackend.whenGET(/^translations\/.*/).respond('<html></html>')
      ResidencyUtils = $injector.get('ResidencyUtils')

  describe "ElementModifier#getDefaultResidencyValueFromEmail", ->

    it 'should return 2 for polytechnique emails', ->
      ResidencyUtils.getDefaultResidencyValueFromEmail('email@polytechnique.edu').should.equal(2)

    it 'should return 3 for supoptique emails', ->
      ResidencyUtils.getDefaultResidencyValueFromEmail('email@institutoptique.fr').should.equal(3)

    it 'should return 1 otherwise', ->
      ResidencyUtils.getDefaultResidencyValueFromEmail('email@ensta.fr').should.equal(1)
      ResidencyUtils.getDefaultResidencyValueFromEmail('notevenanemail').should.equal(1)
      ResidencyUtils.getDefaultResidencyValueFromEmail('').should.equal(1)

    it 'should return 1 if the given email is not a string', ->
      ResidencyUtils.getDefaultResidencyValueFromEmail(42).should.equal(1)
      ResidencyUtils.getDefaultResidencyValueFromEmail(42.2).should.equal(1)
      ResidencyUtils.getDefaultResidencyValueFromEmail(['array', 'with', 'stuff']).should.equal(1)
      ResidencyUtils.getDefaultResidencyValueFromEmail({'string in an object'}).should.equal(1)

    it 'should return 1 if the given email is undefined', ->
      ResidencyUtils.getDefaultResidencyValueFromEmail(undefined).should.equal(1)