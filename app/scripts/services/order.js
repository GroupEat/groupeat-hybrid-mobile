'use strict';

angular.module('groupeat.services.order', ['ngResource'])

.service('Order', function(ENV, $q, $resource) {

	var resource = $resource(ENV.apiEndpoint+'/orders');
	
	var
	currentOrder = {
		'groupOrderId': null,
		'timeLeft': null,
		'currentDiscount': null
	},

	getCurrentOrder = function() {
		return currentOrder;
	},

	resetCurrentOrder = function() {
		currentOrder = {
			'groupOrderId': null,
			'timeLeft': null,
			'currentDiscount': null
		};
	},

	setGroupOrderId = function(id) {
		currentOrder.groupOrderId = id;
	},

	setTimeLeft = function(time) {
		currentOrder.timeLeft = time;
	},

	setCurrentDiscount = function(discount) {
		currentOrder.currentDiscount = discount;
	},

	setCurrentOrder = function(id, time, discount) {
		currentOrder.groupOrderId = id;
		currentOrder.timeLeft = time;
		currentOrder.currentDiscount = discount;
	},

	save = function(requestBody) {
		var defer = $q.defer();
		resource.save(null, requestBody).$promise
		.then(function(response) {
			defer.resolve(response);
		})
		.catch(function(errorResponse) {
			console.log(errorResponse);
		});
		return defer.promise;
	};


	return {
		getCurrentOrder: getCurrentOrder,
		resetCurrentOrder: resetCurrentOrder,
		setGroupOrderId: setGroupOrderId,
		setTimeLeft: setTimeLeft,
		setCurrentDiscount: setCurrentDiscount,
		setCurrentOrder: setCurrentOrder,
		save: save
	};
}
);