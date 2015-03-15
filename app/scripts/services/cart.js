'use strict';

angular.module('groupeat.services.cart', ['groupeat.services.lodash'])

.service('Cart', function(_) {

		var totalPrice = 0;
		var totalQuantity = 0;
		var discountRate = 0;
		var products = [];

		var
		getProducts = function() {
			return products;
		},

		getTotalPrice = function() {
			return totalPrice;
		},

		getTotalQuantity = function() {
			return totalQuantity;
		},

		getDiscountRate = function() {
			return discountRate;
		},

		setProducts = function(value) {
			products = value;
		},

		setTotalPrice = function(value) {
			totalPrice = value;
		},

		setTotalQuantity = function(value) {
			totalQuantity = value;
		},

		setDiscountRate = function(value) {
			discountRate = value;
		},

		refresh = function() {
			// Create index variable to store index of product to be potentially removed from cart
			var indexOfProductToBeDeleted = [false, 0];
			// Update cart
			totalPrice = 0 ;
			totalQuantity = 0 ;

			_.forEach(products, function(product) {
				product.totalQuantity = 0 ;
				product.totalPrice = 0 ;

				_.forEach(product.formats, function(productFormats) {
					product.totalPrice += productFormats.price*productFormats.quantity ;
					product.totalQuantity += productFormats.quantity ;
				});
				totalPrice += product.totalPrice ;
				totalQuantity += product.totalQuantity ;
				if (product.totalQuantity === 0) {
					indexOfProductToBeDeleted = [true, _.indexOf(product)];
				}
			});

			// Remove potentially a product if total quantity has been seen as 0
			if (indexOfProductToBeDeleted[0]) {
				products.splice(indexOfProductToBeDeleted[1] - 1, 1);
			}
		},

		removeProduct = function(productToDelete, formatIndex) {
			// Find product in products and decrement its quantity
			_.forEach(products, function(product) {
				if (product.id === productToDelete.id) {

					_.forEach(product.formats, function(productFormats) {
						if(productFormats.id === formatIndex && productFormats.quantity > 0) {
							productFormats.quantity -= 1 ;
						}
						else {}
					});
				}
				else {}
			});
			refresh();
		},

		addProduct = function(productToAdd, format) {
			// Test if productToAdd exists already in products
			var isInProducts = false ;
			_.forEach(products, function(product){
				if (product.id === productToAdd.id) {
					isInProducts = true;
				}
			});

			if ( isInProducts ) {
				// If productToAdd already exists in products, just increment its quantity
				_.forEach(products, function(product) {
					if (product.id === productToAdd.id) {
						_.forEach(product.formats, function(productFormats) {
							if(productFormats.id === format.id) {
								productFormats.quantity += 1 ;
							}
							else {}
						});
					}
				});
			}
			else {
				// Else, create new product to add in products

				// First the formats array
				var formatToAddInProduct = [];
				for(var i=0 ; i < _.size(productToAdd.formats.data) ; i++) {
					formatToAddInProduct[i] = {
						'id': productToAdd.formats.data[i].id,
						'name': productToAdd.formats.data[i].name,
						'price': productToAdd.formats.data[i].price*((100-discountRate)/100),
						'quantity': 0
					};
					if (formatToAddInProduct[i].id === format.id) {
						// set quantity of productToAdd at 1 (in right format)
						formatToAddInProduct[i].quantity = 1 ;
					}
				}

				// Then the product to add
				var productToAddInProducts = {
						'id': productToAdd.id,
						'name': productToAdd.name,
						'totalQuantity': 1,
						'totalPrice': format.price,
						'formats': formatToAddInProduct
					};

				products.splice(1, 0, productToAddInProducts);
			}

			refresh();
		},

		reset = function() {
			totalQuantity = 0 ;
			totalPrice = 0 ;
			discountRate = 0;
			products = [];
		};

		return {
			getProducts: getProducts,
			getDiscountRate: getDiscountRate,
			getTotalQuantity: getTotalQuantity,
			getTotalPrice: getTotalPrice,
			setProducts: setProducts,
			setDiscountRate: setDiscountRate,
			setTotalQuantity: setTotalQuantity,
			setTotalPrice: setTotalPrice,
			addProduct: addProduct,
			removeProduct: removeProduct,
			refresh: refresh,
			reset: reset
		};
	}
);
