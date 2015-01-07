'use strict';

angular.module('groupeat.services.cart', ['groupeat.services.lodash'])

.service('Cart', function(_) {
	var cart = [
		{
			'name': 'Margherita',
			'id': 1,
			'totalQuantity' : 2,
			'totalPrice': 20,
			'formats':
			[
				{
					'id': 10,
					'size':'Junior',
					'price':8,
					'quantity': 1
				},
				{
					'id': 11,
					'size':'Senior',
					'price':10,
					'quantity': 0
				},
				{
					'id': 12,
					'size':'Mega',
					'price':12,
					'quantity': 1
				}
			]
		},
		{
			'name': '3 Fromages',
			'id': 8,
			'totalQuantity' : 2,
			'totalPrice': 20.5,
			'formats':
			[
				{
					'id': 81,
					'size':'Junior',
					'price':7,
					'quantity': 0
				},
				{
					'id': 82,
					'size':'Senior',
					'price':9,
					'quantity': 1
				},
				{
					'id': 83,
					'size':'Mega',
					'price':11.5,
					'quantity': 1
				}
			]
		}
	];

	var refreshCart = function() {
		_.forEach(cart, function(product) {
			product.totalQuantity = 0 ;
			product.totalPrice = 0 ;
			_.forEach(product.formats, function(productFormats) {
				product.totalQuantity = product.totalQuantity + productFormats.quantity ;
				product.totalPrice += productFormats.quantity * productFormats.price ;
			});

			if (product.totalQuantity === 0) {
				cart.splice(_.indexOf(product) - 1, 1);
			}
		});
	};

	var addProductToCart = function(productIndex, formatIndex) {
		_.forEach(cart, function(product) {
			if (product.id === productIndex) {
				_.forEach(product.formats, function(productFormats) {
					if(productFormats.id === formatIndex) {
						productFormats.quantity += 1 ;
					}
					else {}
				});
			}
			else {}
		});

		refreshCart();
	};

	var getCart = function(){
      return cart;
		};

	var removeProductFromCart = function(productIndex, formatIndex) {

		_.forEach(cart, function(product) {
			if (product.id === productIndex) {
				_.forEach(product.formats, function(productFormats) {
					if(productFormats.id === formatIndex && productFormats.quantity > 0) {
						productFormats.quantity -= 1 ;
					}
					else {}
				});
			}
			else {}
		});

		refreshCart();
	};

	return {
		addProductToCart: addProductToCart,
		getCart: getCart,
		removeProductFromCart: removeProductFromCart
	};

});