import "./Cart.css";
import { GrClose } from "react-icons/gr";
import { BsCartPlus } from "react-icons/bs";
import CartItem from "./CartItem/CartItem";
import { useContext } from "react";
import { Context } from "../../utils/context";

import { loadStripe } from "@stripe/stripe-js";
import { makePaymentRequest } from "../../utils/api";

const Cart = ({ setShowCart }) => {
  const { cartItems, cartSubTotal } = useContext(Context);

  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  );

  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;
      const res = await makePaymentRequest.post("/api/orders", {
        products: cartItems,
      });

      await stripe.redirectToCheckout({
        sessionId: res.data.stripeSession.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="cart_panel">
      <div
        className="opac_layer"
        onClick={() => {
          setShowCart(false);
        }}
      ></div>
      <div className="cart_content">
        <div className="cart-header">
          <span className="heading">Shopping Cart</span>
          <span className="close-btn" onClick={() => setShowCart(false)}>
            <GrClose className="close-btn" />
          </span>
        </div>

        {!cartItems.length && (
          <div className="empty_cart">
            <BsCartPlus className="card_icon" />
            <span>No products in the cart.</span>
            <button
              className="return-cta"
              onClick={() => {
                setShowCart(false);
              }}
            >
              RETURN TO SHOP
            </button>
          </div>
        )}
        {!!cartItems?.length && (
          <>
            <CartItem />
            <div className="cart-footer">
              <div className="subtotal">
                <span className="text">Subtotal:</span>
                <span className="text total">&#8377;{cartSubTotal}</span>
              </div>
              <div className="button">
                <button className="checkout-cta" onClick={handlePayment}>
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default Cart;
