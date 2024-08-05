"use client";
import React, { useEffect, useState } from "react";
import { fetchItemsFromDatabase } from "../myFunctions/funtions";

const Cart = () => {
  const ROUTE = `cart/buyer`;
  const [cart, setCart] = useState([]);

  const getCartFromLocalStorage = () => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    console.log("cart page");
    if (!cart) {
      return;
    }
    setCart(cart);
  };

  const reduceItem = (item) => {
    if (item.quantity <= 0) {
      return;
    }
    const newCart = cart.map((cartItem) => {
      if (cartItem.item_id === item.item_id) {
        cartItem.quantity -= 1;
      }
      return cartItem;
    });
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const increaseItem = (item) => {
    const newCart = cart.map((cartItem) => {
      if (cartItem.item_id === item.item_id) {
        cartItem.quantity += 1;
      }
      return cartItem;
    });
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  useEffect(() => {
    const getCartFromDatabase = async () => {
      const token = localStorage.getItem("token" || null);
      if (!token) {
        getCartFromLocalStorage();
        return;
      }
      const myCart = await fetchItemsFromDatabase(ROUTE, token);
      if (!myCart || myCart.length === 0) {
        getCartFromLocalStorage();
        return;
      }

      setCart(myCart);
    };
    console.log("cart page 1");
    getCartFromDatabase();
    console.log("cart page 2");
  }, []);

  return (
    <ul>
      {cart.length > 0 ? (
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
            <button onClick={() => reduceItem(item)}>Reduce</button>
            <button onClick={() => increaseItem(item)}>Add</button>
          </li>
        ))
      ) : (
        <>Add items to your Cart</>
      )}
    </ul>
  );
};

export default Cart;
