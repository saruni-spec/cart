"use client";
import React from "react";

import { useCart } from "../contexts/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Cart = () => {
  const { cart, removeFromCart, increaseItemNo, reduceItemNo } = useCart();

  const router = useRouter();

  const goToCheckOut = () => {
    router.push("/checkout", { scroll: true });
  };

  return (
    <>
      {cart && cart.length > 0 ? (
        <>
          {" "}
          <ul>
            {cart.map((item) => (
              <li key={item.item_id}>
                <p>
                  {item.name}({item.type})-{item.brand}
                </p>
                <p>
                  Size : {item.size}
                  {item.measurement}
                </p>
                <p>{item.description}</p>
                <p>{item.quantity_in_cart}</p>

                <Image
                  src={item.image_url}
                  alt={item.name}
                  width={50}
                  height={50}
                />

                <button onClick={() => reduceItemNo(item)}>Reduce</button>
                <button onClick={() => increaseItemNo(item)}>Add</button>
                <button onClick={() => removeFromCart(item.item_id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button onClick={goToCheckOut}>CheckOut</button>
        </>
      ) : (
        <>Add items to your Cart</>
      )}
    </>
  );
};

export default Cart;
