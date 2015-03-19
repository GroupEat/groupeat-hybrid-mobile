'use strict';

angular.module('groupeat.services.order', ['groupeat.services.backend-utils'])

.service('Order', function(ENV, $q, $resource, BackendUtils) {

	var resource = $resource(ENV.apiEndpoint+'/orders');

	var
	currentOrder = {
		'groupOrderId': null,
		'endingAt': null,
		'currentDiscount': null
	},

	requestBody = {
		'groupOrderId': null,
		'foodRushDurationInMinutes': null,
		'productFormats': {},
		'street': null,
		'details': null,
		'latitude': null,
		'longitude': null,
		'comment': null
	},

	getRequestBody = function() {
		return requestBody;
	},

	isNewOrder = function() {
		var response ;
		if (currentOrder.groupOrderId === null) {
			response = true;
		}
		else {
			response = false;
		}
		return response;
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

	setComment = function(value) {
		requestBody.comment = value;
	},

	getCurrentOrder = function() {
		return currentOrder;
	},

	resetCurrentOrder = function() {
		currentOrder = {
			'groupOrderId': null,
			'endingAt': null,
			'currentDiscount': null
		};
	},

	setCurrentOrder = function(id, date, discount) {
		currentOrder.groupOrderId = id;
		currentOrder.endingAt = date;
		currentOrder.currentDiscount = discount;
	},

	save = function() {
		var defer = $q.defer();
		console.log(requestBody);
		resource.save(null, requestBody).$promise
		.then(function(response) {
			defer.resolve(response);
		})
		.catch(function(errorResponse) {
			defer.reject(BackendUtils.errorMsgFromBackend(errorResponse));
		});
		return defer.promise;
	},

	getTimeDiff = function(date) {
		var response = null;
		if(date !== null) {
			var currentTime = new Date() ;
			var endingTime = new Date(date.replace(/-/g, '/'));
			response = Math.abs(endingTime - currentTime)/1000;
		}
		return response;
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
		setComment: setComment,
		resetCurrentOrder: resetCurrentOrder,
		setCurrentOrder: setCurrentOrder,
		save: save,
		isNewOrder: isNewOrder,
		getTimeDiff: getTimeDiff
	};
}
);
