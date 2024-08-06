"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import {
  addFormToDatabase,
  fetchItemsFromDatabase,
  debounce,
} from "../myFunctions/funtions";
import { useUser } from "./UserContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cart_id, setCart_id] = useState(null);
  const [firstLoad, setfirstLoad] = useState(true);
  const { token } = useUser();

  const syncCart = async () => {
    console.log("syncing cart checking token");
    if (token) {
      console.log("syncing cart");
      const results = await addFormToDatabase(
        { cartItems: cart, cart_id: cart_id },
        "cart/buyer",

        token
      );
      const CartAdded = results.DataFetched;
      setCart(CartAdded.cart);
      setCart_id(CartAdded.cart_id);
    } else {
      const newToken = localStorage.getItem("token");
      if (!newToken) {
        return;
      }

      console.log("syncing cart with new token");
      await addFormToDatabase(
        { cartItems: cart, cart_id: cart_id },
        "cart/buyer",

        newToken
      );
    }
  };

  const debounceSyncCart = debounce(syncCart, 10000);

  const addToCart = (item) => {
    console.log(item, "adding to cart");
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.item_id === item.item_id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.item_id === item.item_id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevCart, { ...item, quantity: 1, addedToCart: true }];
      }
    });

    console.log(cart, "em added to this cart");
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((i) => i.item_id !== itemId));
  };

  const reduceItemNo = (item) => {
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
  };

  const increaseItemNo = (item) => {
    if (item.quantity >= item.inventory_quantity) {
      return;
    }
    const newCart = cart.map((cartItem) => {
      if (cartItem.item_id === item.item_id) {
        cartItem.quantity += 1;
      }
      return cartItem;
    });
    setCart(newCart);
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        const results = await fetchItemsFromDatabase("cart/buyer", token);
        const fetchedCart = results.DataFetched;
        if (fetchedCart && fetchedCart.length > 0) {
          setCart(fetchedCart);
        } else {
          const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
          setCart(localCart);
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(localCart);
      }
    };

    fetchCart();
  }, [token]);

  useEffect(() => {
    if (firstLoad) {
      return;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("added to locaa storage", cart);
    debounceSyncCart();
  }, [cart, firstLoad]);

  useEffect(() => {
    const fetchCart = async () => {
      console.log("fetching cart on moutn");
      if (token) {
        const results = await fetchItemsFromDatabase("cart/buyer", token);
        const fetchedCart = results.DataFetched;
        if (fetchedCart && fetchedCart.length > 0) {
          console.log("fetching cart on moutn server");
          setCart(fetchedCart);
        } else {
          console.log("fetching cart on moutn local 1");
          const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
          setCart(localCart);
        }
      } else {
        console.log("fetching cart on moutn  local 2");
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(localCart);
      }
      setfirstLoad(false);
    };

    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, increaseItemNo, reduceItemNo }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
