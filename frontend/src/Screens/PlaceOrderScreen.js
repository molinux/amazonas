import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';

function PlaceOrderScreen(props) {

  const cart = useSelector(state => state.cart);

  const { cartItems, shipping, payment } = cart;
  // If shipping info are not provided, redirect to shipping page
  if(!shipping.address) {
    props.history.push('/shipping');
    // If the payment method is not selected, redirect to payment page
  } else if (!payment.paymentMethod) {
    props.history.push('/payment')
  }

  // a = acumulator, c = cart item, 0 = default acumulator value
  const itemsPrice = cartItems.reduce((a, c) => a + c.price*c.qty, 0);
  // If greater than R$ 100 = free shipping, or else = R$ 10
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = 0.15 * itemsPrice;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const dispatch = useDispatch();
  
  const placeOrderHandler = () => {
    //create an order
  }

  useEffect(() => {
    
  }, []);

  const checkoutHandler = () => {
    props.history.push('/signin?redirect=shipping');
  }


  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <div className="placeorder">
        <div className="placeorder-info">
          <div>
            <h3>
              Shipping
            </h3>
            <div>
              {cart.shipping.address}, {cart.shipping.city},
              {cart.shipping.postalCode}, {cart.shipping.country}
            </div>
          </div>
          <div>
            <h3>Payment</h3>
            <div>
              Payment Method: {cart.payment.paymentMethod}
            </div>
          </div>
          <div>

            <ul className="cart-list-container">
              <li>
                <h3>
                  Shopping Cart
                </h3>
                <div>
                  Price
                </div>
              </li>
              {
                cartItems.length === 0 ? 
                <div>
                  Cart is empty
                </div>
                :
                cartItems.map( item => 
                  <li>
                    <div className="cart-image">
                      <img src={item.image} alt="product" />
                    </div>
                    <div className="cart-name">
                      <div>
                        <Link to={'/product/' + item.product }>
                        {item.name}
                        </Link>
                      </div>
                      <div>
                        Qty: {item.qty}
                      </div>
                    </div>
                    <div className="cart-price">
                      R$ {item.price}
                    </div>
                  </li>
                )
              }
            </ul>
          </div>
        </div>
        <div className="placeorder-action">
          <ul>
            <li>
              <button className="button primary full-width" onClick={placeOrderHandler}>Place Order</button>
            </li>
            <li>
              <h3>Order Summary</h3>
            </li>
            <li>
              <div>Items</div>
              <div>R$ {itemsPrice}</div>
            </li>
            <li>
              <div>Shipping</div>
              <div>R$ {shippingPrice}</div>
            </li>
            <li>
              <div>Tax</div>
              <div>R$ {taxPrice}</div>
            </li>
            <li>
              <div>Order Total</div>
              <div>R$ {totalPrice}</div>
            </li>
          </ul>
          
        </div>
      </div>
    </div>
  )
}

export default PlaceOrderScreen;