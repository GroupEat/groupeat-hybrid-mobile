describe 'Service: Cart', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat'
    module 'templates'

  Cart = scope = $httpBackend = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')
      Cart = $injector.get('Cart')
      _ = $injector.get('_')

  describe "Cart Service contents :", ->
    it "should create an objet of products", ->
      expect(Cart.products).not.to.equal(null)

  describe "Cart Service methods :", ->

    afterEach () ->
      scope.$apply()

    it "should return cart", ->
      testCart = Cart.refreshCart()
      expect(testCart).to.equal(Cart.products)

    it "should refresh empty cart", ->
      testCart = Cart.getCart()
      testCart.cartTotalPrice += 10
      testCart.cartTotalQuantity += 1
      testCart.productsItems = [{}]

      Cart.refreshCart()
      expect(testCart.cartTotalPrice).to.equal(0)
      expect(testCart.cartTotalQuantity).to.equal(0)

    it "refreshCart should update prices and quantities of cart and childrens", ->
      testCart = Cart.getCart()
      testCart.productsItems = [
        {
          id: 12,
          name: 'test name',
          totalQuantity: 2222,
          totalPrice: 1222,
          formats: [
            {
              id: 1,
              size: 'test size 1',
              price: 10,
              quantity: 2
            }
            ,
            {
              id: 2,
              size: 'test size 2',
              price: 15,
              quantity: 1
            }
          ]
        },
        {
        id: 5,
        name: 'test name',
        totalQuantity: 2222,
        totalPrice: 1222,
        formats: [
            {
              id: 6,
              size: 'test size 1',
              price: 10,
              quantity: 2
            },
            {
              id: 7,
              size: 'test size 2',
              price: 15,
              quantity: 2
            }
          ]
        }
      ]

      Cart.refreshCart()

      expect(testCart.productsItems[0].totalQuantity).to.equal(3)
      expect(testCart.productsItems[1].totalQuantity).to.equal(4)
      expect(testCart.productsItems[0].totalPrice).to.equal(35)
      expect(testCart.productsItems[1].totalPrice).to.equal(50)

      expect(testCart.cartTotalQuantity).to.equal(7)
      expect(testCart.cartTotalPrice).to.equal(85)

    it "should delete productsItems when a product total quantity equals 0", ->
      testCart = Cart.getCart()

      testCart.productsItems = [
        {
        id: 12,
        name: 'test name',
        totalQuantity: 22,
        totalPrice: 1222,
        formats: [
            {
              id: 1,
              size: 'test size 1',
              price: 10,
              quantity: 0
            },
            {
              id: 2,
              size: 'test size 2',
              price: 15,
              quantity: 0
            }
          ]
        },
        {
          id: 5,
          name: 'test name',
          totalQuantity: 2222,
          totalPrice: 1222,
          formats: [
            {
              id: 6,
              size: 'test size 1',
              price: 10,
              quantity: 2
            },
            {
              id: 7,
              size: 'test size 2',
              price: 15,
              quantity: 2
            }
          ]
        }
      ]

      Cart.refreshCart()

      testCart.productsItems.should.have.length(1)

    it "should remove product by decreasing quantity", ->
      testCart = Cart.getCart()

      testCart.productsItems = [
        {
          id: 12,
          name: 'test name',
          totalQuantity: 22,
          totalPrice: 1222,
          formats: [
            {
              id: 1,
              size: 'test size 1',
              price: 10,
              quantity: 2
            },
            {
              id: 2,
              size: 'test size 2',
              price: 15,
              quantity: 1
            }
          ]
        },
        {
          id: 5,
          name: 'test name',
          totalQuantity: 2222,
          totalPrice: 1222,
          formats: [
            {
              id: 6,
              size: 'test size 1',
              price: 10,
              quantity: 2
            },
            {
              id: 7,
              size: 'test size 2',
              price: 15,
              quantity: 2 # quantity to decrease
            }
          ]
        }
      ]

      Cart.removeProductFromCart(testCart.productsItems[1], testCart.productsItems[1].formats[1].id)
      expect(testCart.productsItems[1].formats[1].quantity).to.equal(1)

    it "should reset cart", ->
      testCart = Cart.getCart()
      testCart.cartTotalPrice = 111
      testCart.cartTotalQuantity = 555
      testCart.productsItems = [
        'id': 12,
        'name': 'test name',
        'totalQuantity': 22,
        'totalPrice': 1222,
        'formats': [
            'id': 1,
            'size': 'test size 1',
            'price': 10,
            'quantity': 2
            ,
            'id': 2,
            'size': 'test size 2',
            'price': 15,
            'quantity': 1
          ]
        ,
        'id': 5,
        'name': 'test name',
        'totalQuantity': 2222,
        'totalPrice': 1222,
        'formats': [
            'id': 6,
            'size': 'test size 1',
            'price': 10,
            'quantity': 2
            ,
            'id': 7,
            'size': 'test size 2',
            'price': 15,
            'quantity': 2 # quantity to decrease
          ]
      ]

      Cart.resetCart()

      expect(testCart.cartTotalQuantity).to.equal(0)
      expect(testCart.cartTotalPrice).to.equal(0)
      testCart.productsItems.should.have.length(0)

    it "should add an existing product", ->
      testCart = Cart.getCart()
      testCart.productsItems = [
        {
          id: 12,
          name: 'test name',
          totalQuantity: 22,
          totalPrice: 1222,
          formats: [
            {
              id: 1,
              size: 'test size 1',
              price: 10,
              quantity: 2
            },
            {
              id: 2,
              size: 'test size 2',
              price: 15,
              quantity: 1
            }
          ]
        },
        {
          id: 5,
          name: 'test name',
          totalQuantity: 2222,
          totalPrice: 1222,
          formats: [
            {
              id: 6,
              size: 'test size 1',
              price: 10,
              quantity: 2
            },
            {
              id: 7,
              size: 'test size 2',
              price: 15,
              quantity: 2 # quantity to increase
            }
          ]
        }
      ]

      productToAdd = # data coming from restaurant menu alias pizzas*.json
        name: 'test name',
        id: 5, # same product id as above
        description: 'test description',
        formats:[
            {
              id: 10,
              size:'Junior',
              price:8
            },
            {
              id: 7, # same format id as above
              size:'Senior',
              price:10
            }
        ]

      Cart.addProductToCart(productToAdd, productToAdd.formats[1])
      expect(testCart.productsItems[1].formats[1].quantity).to.equal(3)

    it "should add a new product in cart", ->
      testCart = Cart.getCart()

      productToAdd = # data coming from restaurant menu alias pizzas*.json
        name: 'test name',
        id: 5,
        description: 'test description',
        formats:
          [
            {
              id: 10,
              size:'Junior',
              price:8
            },
            {
              id: 7, # format to add for test
              size:'Senior',
              price:10
            }
          ]

      Cart.addProductToCart(productToAdd, productToAdd.formats[1])

      # test if data from restaurant (above) has been added to CART (different structures)
      testCart.productsItems.should.have.length(1)

      expect(testCart.productsItems[0].id).to.equal(5)
      expect(testCart.productsItems[0].name).to.equal('test name')
      testCart.productsItems[0].should.have.property('totalPrice') # dont care of value because will be update by refreshCart, which has been tested
      testCart.productsItems[0].should.have.property('totalQuantity')
      testCart.productsItems[0].formats.should.have.length(2)

      expect(testCart.productsItems[0].formats[0].id).to.equal(10)
      expect(testCart.productsItems[0].formats[1].id).to.equal(7)

      expect(testCart.productsItems[0].formats[0].size).to.equal('Junior')
      expect(testCart.productsItems[0].formats[1].size).to.equal('Senior')

      expect(testCart.productsItems[0].formats[0].price).to.equal(8)
      expect(testCart.productsItems[0].formats[1].price).to.equal(10)

      testCart.productsItems[0].formats[0].should.have.property('quantity')
      testCart.productsItems[0].formats[1].should.have.property('quantity')
