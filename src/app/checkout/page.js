import React, { useEffect, useState } from "react";

const CheckOut = ({ params }) => {
  const cartId = params.cart_id;

  const [cart, setCart] = useState([]);
  async function fetchCartItems(cartId) {
    const data = "fetch cart items";
    setCart(data);
  }

  const placeOrder = async () => {};

  useEffect(() => {
    fetchCartItems(cartId);
  }, [cart, cartId]);

  return (
    <div>
      <ul>
        {cart.map((item) => (
          <li key={item.cart_id}>
            {item.name} - {item.price} - {item.quantity}
          </li>
        ))}
      </ul>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
};

export default CheckOut;
