'use strict';

angular.module('groupeat.services.order', ['ngResource', 'groupeat.services.element-modifier'])

.service('Order', function(ENV, $q, $resource, ElementModifier) {

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
			defer.reject(ElementModifier.errorMsgFromBackend(errorResponse));
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