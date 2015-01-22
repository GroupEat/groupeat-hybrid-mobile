exports.config = {
	capabilities: {
		'browserName': 'chrome'
	},
	specs: [
		'e2e/specs/**/*.spec.js'
	],
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000,
		isVerbose: true
	},
	allScriptsTimeout: 20000,
	onPrepare: function() {
		browser.driver.manage().window().maximize();
		browser.driver.get('http://localhost:4400/?enableripple=cordova-3.0.0-iPhone5');
		// To enable in case of syntonization errors from protractor
		// var ptor = protractor.getInstance();
		// ptor.ignoreSynchornization = true;
		browser.sleep(2000);
		browser.driver.switchTo().frame(0);
	}
};
