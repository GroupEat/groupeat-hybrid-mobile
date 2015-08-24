'use strict';
angular.module('groupeat.services.cart', ['groupeat.services.lodash']).service('Cart', function (_) {
  var totalPrice = 0;
  var totalQuantity = 0;
  var discountRate = 0;
  var products = [];
  var getProducts = function () {
      return products;
    }, getProductQuantity = function (productToGet, format) {
      var quantityToReturn = 0;
      _.forEach(products, function (product) {
          if (productToGet.name === product.name && format.name === product.format) {
            quantityToReturn = product.quantity;
          }
      });
      return quantityToReturn;
    }, getTotalPrice = function () {
      return totalPrice;
    }, getTotalQuantity = function () {
      return totalQuantity;
    }, getDiscountRate = function () {
      return discountRate;
    }, setProducts = function (value) {
      products = value;
    }, setTotalPrice = function (value) {
      totalPrice = value;
    }, setTotalQuantity = function (value) {
      totalQuantity = value;
    }, setDiscountRate = function (value) {
      discountRate = value;
    },refresh = function() {
      totalQuantity = 0;
      totalPrice = 0;
      _.forEach(products, function (product) {
        totalQuantity += product.quantity;
        totalPrice += product.price;
      });
    },removeProduct = function (productToDelete, format) {
      // Find product in products and decrement its quantity
      var productToDeleteIndex;
      if (hasAtLeastOneProduct(productToDelete, format)) {
        _.forEach(products, function (product) {
          if (product.name === productToDelete.name && product.format === format.name) {
            product.quantity -= 1;
            product.price = product.quantity * format.price;
            if(product.quantity === 0) {
              productToDeleteIndex = _.indexOf(products, product);
            }
          }
        });
        if(productToDeleteIndex) {
          products.splice(productToDeleteIndex, 1);
        }
        refresh();
      }
    }, hasAtLeastOneProduct = function (productToTest, format) {
      /*
			if product.id is in products, that means there is at least
			one product (senior, junior,.... whatever) added by user
			 */
      var isInProducts = false;
      _.forEach(products, function (product) {
        if (product.name === productToTest.name && product.format === format.name) {
          isInProducts = true;
        }
      });
      return isInProducts;
    }, addProduct = function (productToAdd, format) {
      /*
			Test if productToAdd exists already in products
			We do that directly thanks to the method 'hasAtLeastOneProduct'
			*/
      if (hasAtLeastOneProduct(productToAdd, format)) {
        // If productToAdd already exists in products, just increment its quantity
        _.forEach(products, function (product) {
          if (product.name === productToAdd.name && product.format === format.name) {
              product.quantity += 1;
              product.price = product.quantity * format.price;
          }
        });
      } else {
        // Then the product to add
        var productToAddInProducts = {
          'id': format.id,
          'name': productToAdd.name,
          'format': format.name,
          'quantity': 1,
          'price': format.price,
        };
        products.push(productToAddInProducts);
      }
      refresh();
    }, reset = function () {
      totalQuantity = 0;
      totalPrice = 0;
      discountRate = 0;
      products = [];
    };
  return {
    getProducts: getProducts,
    getProductQuantity: getProductQuantity,
    getDiscountRate: getDiscountRate,
    getTotalQuantity: getTotalQuantity,
    getTotalPrice: getTotalPrice,
    hasAtLeastOneProduct: hasAtLeastOneProduct,
    setProducts: setProducts,
    setDiscountRate: setDiscountRate,
    setTotalQuantity: setTotalQuantity,
    setTotalPrice: setTotalPrice,
    addProduct: addProduct,
    removeProduct: removeProduct,
    reset: reset,
    refresh: refresh
  };
});
