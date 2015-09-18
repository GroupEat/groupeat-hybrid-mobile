describe 'Service: CustomerInformationChecker', ->

  beforeEach ->
    module 'groupeat.services.customer-information-checker'

  beforeEach ->
    inject ($rootScope, $injector) ->
      @$rootScope = $rootScope
      @Address = $injector.get 'Address'
      @Credentials = $injector.get 'Credentials'
      @Customer = $injector.get 'Customer'
      @CustomerStorage = $injector.get 'CustomerStorage'
      @CustomerInformationChecker = $injector.get 'CustomerInformationChecker'
      @$q = $injector.get '$q'
      @Popup = $injector.get 'Popup'
      @sandbox = sinon.sandbox.create()
      @$state = $injector.get '$state'

  afterEach ->
    @sandbox.restore()

  describe 'CustomerInformationStorage#check', ->

    it 'should be fulfilled if the local storage contains all needed information', ->
      @sandbox.stub(@CustomerStorage, 'getIdentity').returns
        firstName: 'Gustavo'
        lastName: 'Fring'
        phoneNumber: 'classified'
      @sandbox.stub(@CustomerStorage, 'getAddress').returns
        residency: 'Los Pollos Hermanos'
      @CustomerInformationChecker.check().should.be.fulfilled
      @$rootScope.$digest()

    it 'should be resolved if the local storage does not but if the backend does contain all needed information', ->
      @sandbox.stub(@CustomerStorage, 'getIdentity').returns {}
      @sandbox.stub(@CustomerStorage, 'getAddress').returns {}
      @sandbox.stub(@Credentials, 'get').returns
        id: 1
      @sandbox.stub(@Customer, 'get').returns
        firstName: 'Gustavo'
        lastName: 'Fring'
        phoneNumber: 'classified'
      @sandbox.stub(@Address, 'get').returns
        residency: 'Los Pollos Hermanos'
      @CustomerInformationChecker.check().should.be.fulfilled
      @$rootScope.$digest()

    it 'should open a popup with the address when information are missing', ->
      @sandbox.stub(@CustomerStorage, 'getIdentity').returns {}
      @sandbox.stub(@CustomerStorage, 'getAddress').returns {}
      @sandbox.stub(@Credentials, 'get').returns
        id: 1
      @sandbox.stub(@Customer, 'get').returns
        firstName: 'Gustavo'
        lastName: 'Fring'
        phoneNumber: 'classified'
      @sandbox.stub(@Address, 'get').returns
        notResidency: 'Pizza on the roof'
      @sandbox.stub(@Popup, 'confirm').returns @$q.defer().promise
      @CustomerInformationChecker.check()
      @$rootScope.$digest()
      @Popup.confirm.should.have.been.calledWithExactly 'missingProperties', 'missingCustomerInformationMessage', 'settings'

    it 'should change the state to app.settings if the customer confirms the popup', ->
      @sandbox.stub(@CustomerStorage, 'getIdentity').returns {}
      @sandbox.stub(@CustomerStorage, 'getAddress').returns {}
      @sandbox.stub(@Credentials, 'get').returns
        id: 1
      @sandbox.stub(@Customer, 'get').returns
        firstName: 'Gustavo'
        lastName: 'Fring'
        phoneNumber: 'classified'
      @sandbox.stub(@Address, 'get').returns
        notResidency: 'Pizza on the roof'
      @sandbox.stub(@Popup, 'confirm').returns @$q.when true
      @sandbox.stub @$state, 'go'
      @CustomerInformationChecker.check().should.be.rejected
      @$rootScope.$digest()
      @$state.go.should.have.been.calledWithExactly 'app.settings'
