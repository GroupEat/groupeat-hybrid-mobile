describe 'Service: ResidencyUtils', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.residency-utils'
    module 'templates'

  ResidencyUtils = scope = $httpBackend = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('<html></html>')
      ResidencyUtils = $injector.get('ResidencyUtils')

  describe "ElementModifier#getDefaultResidencyValueFromEmail", ->

    it 'should return polytechnique for polytechnique emails', ->
      ResidencyUtils.getDefaultResidencyValueFromEmail('email@polytechnique.edu').should.equal('polytechnique')

    it 'should return supoptique for supoptique emails', ->
      ResidencyUtils.getDefaultResidencyValueFromEmail('email@institutoptique.fr').should.equal('supoptique')

    it 'should return ENSTAParisTech otherwise', ->
      ResidencyUtils.getDefaultResidencyValueFromEmail('email@ensta.fr').should.equal('ENSTAParisTech')
      ResidencyUtils.getDefaultResidencyValueFromEmail('notevenanemail').should.equal('ENSTAParisTech')
      ResidencyUtils.getDefaultResidencyValueFromEmail('').should.equal('ENSTAParisTech')

    it 'should return ENSTAParisTech if the given email is not a string', ->
      ResidencyUtils.getDefaultResidencyValueFromEmail(42).should.equal('ENSTAParisTech')
      ResidencyUtils.getDefaultResidencyValueFromEmail(42.2).should.equal('ENSTAParisTech')
      ResidencyUtils.getDefaultResidencyValueFromEmail(['array', 'with', 'stuff']).should.equal('ENSTAParisTech')
      ResidencyUtils.getDefaultResidencyValueFromEmail({'string in an object'}).should.equal('ENSTAParisTech')

    it 'should return ENSTAParisTech if the given email is undefined', ->
      ResidencyUtils.getDefaultResidencyValueFromEmail(undefined).should.equal('ENSTAParisTech')
