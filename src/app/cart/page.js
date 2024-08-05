"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../contexts/CartContext";

const Cart = () => {
  const { cart, removeFromCart, increaseItemNo, reduceItemNo } = useCart();

  const [currentCart, setCurrentCart] = useState([]);
  useEffect(() => {
    setCurrentCart(cart);
    console.log("fetching cart in cart ppage", localStorage.getItem("cart"));
  }, [cart]);

  return (
    <>
      <ul>
        {currentCart.length > 0 ? (
          cart.map((item) => (
            <li key={item.cart_id}>
              <p>
                {item.name}({item.type})-{item.brand}
              </p>
              <p>
                Size : {item.size}
                {item.measurement}
              </p>
              <p>{item.description}</p>

              <p>{item.image_url}</p>
              <p>{item.quantity}</p>
              <button onClick={() => reduceItemNo(item)}>Reduce</button>
              <button onClick={() => increaseItemNo(item)}>Add</button>
              <button onClick={() => removeFromCart(item.item_id)}>
                Remove
              </button>
            </li>
          ))
        ) : (
          <>Add items to your Cart</>
        )}
      </ul>
      <button>
        <Link href={`/checkout`}>Check Out</Link>
      </button>
    </>
  );
};

export default Cart;
