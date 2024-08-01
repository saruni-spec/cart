"use client";
import React from "react";
import Link from "next/link";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  async function fetchCart() {
    const data = "fetch cart";
    setCart(data);
  }
  async function fetchCartItems(cartId) {
    const data = "fetch Cart Items";
    setCartItems(data);
  }

  useEffect(() => {
    fetchCart();
    fetchCartItems(cart.cart_id);
  }, [cart]);

  return (
    <div>
      <ul>
        {cartItems.map((item) => (
          <li key={item.cart_id}>
            {item.name} - {item.price} - {item.quantity}
          </li>
        ))}
      </ul>
      <button>
        {" "}
        <Link href={`/checkout/${cart.cart_id}`}>Check Out</Link>
      </button>
    </div>
  );
};

export default Cart;
