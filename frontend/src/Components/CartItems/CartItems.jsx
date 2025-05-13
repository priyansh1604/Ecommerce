import React, { useContext } from 'react'
import './CartItems.css'
import { ShopContext } from '../../Context/ShoptContext'

import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = () => {

    const {getTotalCartAmount, all_product, cartItems, removeFromCart} = useContext(ShopContext);
    const handleCheckout = async () => {
    const amount = getTotalCartAmount();

    try {
        const res = await fetch("https://ecommerce-qbcy.onrender.com/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount }),
        });

        const order = await res.json();

        const options = {
            key: "rzp_test_kdNdtNdGkhC181", 
            amount: order.amount,
            currency: "INR",
            name: "MyShop Checkout",
            description: "Test Transaction",
            order_id: order.id,
            handler: function (response) {
                alert("Payment successful!");
                console.log(response); 
            },
            prefill: {
                name: "John Doe",
                email: "johndoe@example.com",
                contact: "9999999999"
            },
            theme: {
                color: "#3399cc"
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

    } catch (error) {
        console.error("Checkout error", error);
        alert("Payment failed to initialize.");
    }
};

  return (
    <div className='cartitems'>

        <div className="cartitems-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
        </div>

        <hr />

        {all_product.map((e) => {
            if(cartItems[e.id]>0){
                
                return <div>
                            <div className="cartitems-format cartitems-format-main">
                                <img src={e.image} className='carticon-product-icon' alt="" />
                                <p>{e.name}</p>
                                <p>${e.new_price}</p>
                
                                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                                <p>${e.new_price*cartItems[e.id]}</p>
                                <img className='cartitems-remove-icno' src={remove_icon} onClick={() => {removeFromCart(e.id)}} alt="" />
                            </div>
                
                            <hr />
                
                        </div>

            }
            return null;
        })}

        <div className="cartitems-down">
            <div className="cartitems-total">
                <h1>Cart Totals</h1>

                <div>

                    <div className="cartitems-total-item">
                        <p>Subtotal</p>
                        <p>${getTotalCartAmount()}</p>
                    </div>

                    <hr />

                    <div className="cartitems-total-item">
                        <p>Shipping Fee</p>
                        <p>Free</p>
                    </div>

                    <hr />

                    <div className="classitems-total-item">
                        <h3>Total</h3>
                        <h3>${getTotalCartAmount()}</h3>
                    </div>
                </div>

                <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>

            </div>

            <div className="cartitems-promocode">
                <p>If you have a promo code, Enter it here</p>

                <div className="cartitems-promobox">
                    <input type="text" placeholder='promo code' />
                    <button>Submit</button>
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default CartItems
