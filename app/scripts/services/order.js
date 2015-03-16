'use strict';

angular.module('groupeat.services.order', [
	'config',
	'ngResource',
	'groupeat.services.element-modifier'
])

.service('Order', function(ENV, $q, $resource, BackendUtils) {

	var resource = $resource(ENV.apiEndpoint+'/orders');

	var
	currentOrder = {
		'groupOrderId': null,
		'timeLeft': null,
		'currentDiscount': null
	},

	requestBody = {
		'groupOrderId': null,
		'foodRushDurationInMinutes': null,
		'productFormats': {},
		'street': null,
		'details': null,
		'latitude': null,
		'longitude': null
	},

	getRequestBody = function() {
		return requestBody;
	},

	setGroupOrderId = function(value) {
		requestBody.groupOrderId = value;
	},
	setFoodRushTime = function(value) {
		requestBody.foodRushDurationInMinutes = value;
	},
	setProductFormats = function(value) {
		requestBody.productFormats = value;
	},
	setStreet = function(value) {
		requestBody.street = value;
	},
	setDetails = function(value) {
		requestBody.details = value;
	},
	setLatitude = function(value) {
		requestBody.latitude = value;
	},
	setLongitude = function(value) {
		requestBody.longitude = value;
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

	setCurrentOrder = function(id, time, discount) {
		currentOrder.groupOrderId = id;
		currentOrder.timeLeft = time;
		currentOrder.currentDiscount = discount;
	},

	save = function() {
		var defer = $q.defer();
		resource.save(null, requestBody).$promise
		.then(function(response) {
			defer.resolve(response);
		})
		.catch(function(errorResponse) {
			defer.reject(BackendUtils.errorMsgFromBackend(errorResponse));
		});
		return defer.promise;
	};


	return {
		getCurrentOrder: getCurrentOrder,
		getRequestBody: getRequestBody,
		setGroupOrderId: setGroupOrderId,
		setFoodRushTime: setFoodRushTime,
		setProductFormats: setProductFormats,
		setStreet: setStreet,
		setDetails: setDetails,
		setLatitude: setLatitude,
		setLongitude: setLongitude,
		resetCurrentOrder: resetCurrentOrder,
		setCurrentOrder: setCurrentOrder,
		save: save
	};
}
);
