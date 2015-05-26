'use strict';

angular.module('groupeat.services.order', [
	'constants',
	'groupeat.services.backend-utils',
	'groupeat.services.lodash'
])

.service('Order', function(_, $q, $resource, BackendUtils, ENV) {

	var resource = $resource(ENV.apiEndpoint+'/orders/:id'),
	fromGroupOrderResource = $resource(ENV.apiEndpoint+'/customers/:customerId/groupOrders/:groupOrderId/orders?include=restaurant'),
	forCustomerResource = $resource(ENV.apiEndpoint+'/customers/:customerId/orders?include=groupOrder.restaurant');

	var
	currentOrder = {
		'groupOrderId': null,
		'endingAt': null,
		'currentDiscount': null,
		'remainingCapacity': null
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

	getFoodRushTime = function() {
		return requestBody.foodRushDurationInMinutes;
	},

	getCurrentOrder = function() {
		return currentOrder;
	},

	resetCurrentOrder = function() {
		currentOrder = {
			'groupOrderId': null,
			'endingAt': null,
			'currentDiscount': null,
			'remainingCapacity': null
		};
		requestBody = {
			'groupOrderId': null,
			'foodRushDurationInMinutes': null,
			'productFormats': {},
			'street': null,
			'details': null,
			'latitude': null,
			'longitude': null,
			'comment': null
		};
	},

	setCurrentOrder = function(id, date, discount, capacity) {
		currentOrder.groupOrderId = id;
		currentOrder.endingAt = date;
		currentOrder.currentDiscount = discount;
		currentOrder.remainingCapacity = capacity;
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
	},

	getTimeDiff = function(endingTime) {
		var response = null;
		if(endingTime !== null) {
			var currentTime = new Date();
			if (!(endingTime instanceof Date))
			{
				endingTime = new Date(endingTime.replace(/-/g, '/'));
			}
			response = Math.abs(endingTime - currentTime)/1000;
		}
		return response;
	},

	get = function(orderId) {
		var defer = $q.defer();
		resource.get({id: orderId}).$promise
		.then(function(response) {
			defer.resolve(response.data);
		})
		.catch(function() {
			defer.reject();
		});
		return defer.promise;
	},

	queryForGroupOrder = function(customerId, groupOrderId) {
    var defer = $q.defer();
    fromGroupOrderResource.get({customerId: customerId, groupOrderId: groupOrderId}).$promise
    .then(function(response) {
      defer.resolve(response.data);
    })
    .catch(function() {
      defer.reject();
    });
    return defer.promise;
  },

	queryForCustomer = function(customerId) {
		var defer = $q.defer();
		forCustomerResource.get({customerId: customerId}).$promise
		.then(function(response) {
			var orders = [], oldOrders = [];
			_.forEach(response.data, function(rawOrder) {
        var order = {'discountedPrice': rawOrder.discountedPrice/100};
				order.discount = 100*(rawOrder.rawPrice-rawOrder.discountedPrice)/rawOrder.rawPrice;
				order.restaurant = rawOrder.groupOrder.data.restaurant.data.name;
				order.closedAt = rawOrder.groupOrder.data.closedAt ? new Date(rawOrder.groupOrder.data.closedAt) : null;
				order.endingAt = new Date(rawOrder.groupOrder.data.endingAt);
				if (order.closedAt)
				{
					oldOrders.push(order);
				}
				else
				{
					orders.push(order);
				}
      });
      defer.resolve(orders.concat(_.sortByOrder(oldOrders, ['closedAt'], [false])));
		})
		.catch(function() {
			defer.reject();
		});
		return defer.promise;
	};

	return {
		get: get,
		getCurrentOrder: getCurrentOrder,
		queryForGroupOrder: queryForGroupOrder,
		queryForCustomer: queryForCustomer,
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
		getTimeDiff: getTimeDiff,
		getFoodRushTime: getFoodRushTime
	};
}
);
