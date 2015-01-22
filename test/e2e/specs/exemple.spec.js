describe('Exemple', function() {

	it('should show the bottom tabs on the initial view', function() {
		var bottomTabs = element(by.id('bottom-tabs'));
		expect(bottomTabs.isPresent()).toBe(true);
	});

});
