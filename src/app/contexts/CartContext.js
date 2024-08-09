"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import {
  addFormToDatabase,
  debounce,
  deleteItemFromDatabase,
} from "../myFunctions/funtions";
import { useUser } from "./UserContext";

const initialCartState = [];
const ROUTE = "cart/buyer";
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(initialCartState);
  const [cart_id, setCart_id] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const { token } = useUser();

  const syncCart = async (cart) => {
    if (syncing) {
      console.log("another syncing cart");
      return;
    }

    console.log("syncing cart checking token");
    if (!token) {
      console.log("no token,no syncing");
      return;
    }
    setSyncing(true);
    console.log("we have token,syncing cart", cart);
    const results = await addFormToDatabase(
      { cartItems: cart, cart_id: cart_id },
      ROUTE,

      token
    );

    const CartAdded = results.DataFetched;
    console.log(CartAdded.cart, "cart Aded After Sync");
    setCart(CartAdded.cart);
    setCart_id(CartAdded.cart_id);
    setSyncing(false);
  };

  const debounceSyncCart = debounce(syncCart, 10000);

  const saveCartToLocalStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const addToCart = (item) => {
    console.log(item, "adding to cart", cart);
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.item_id === item.item_id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.item_id === item.item_id
            ? { ...i, quantity_in_cart: i.quantity_in_cart + 1 }
            : i
        );
      } else {
        return [
          ...prevCart,
          { ...item, quantity_in_cart: 1, addedToCart: true },
        ];
      }
    });
    saveCartToLocalStorage(cart);
    debounceSyncCart(cart);
    console.log(cart, "em added to this cart");
  };

  const removeFromCart = async (item) => {
    setCart((prevCart) => prevCart.filter((i) => i.item_id !== item.item_id));
    if (token) {
      const results = await deleteItemFromDatabase(item, ROUTE, token);
      setCart(results.DataFetched.cart);
    }
  };

  const reduceItemNo = (item) => {
    console.log(item, "Reducing to cart", cart);
    if (item.quantity_in_cart <= 0) {
      return;
    }
    const newCart = cart.map((cartItem) => {
      if (cartItem.item_id === item.item_id) {
        cartItem.quantity_in_cart -= 1;
      }
      return cartItem;
    });
    setCart(newCart);
    saveCartToLocalStorage(cart);
    debounceSyncCart(cart);
  };

  const increaseItemNo = (item) => {
    console.log(item, "adding No +1 cart", cart);
    if (item.quantity_in_cart >= item.inventory_quantity) {
      return;
    }
    const newCart = cart.map((cartItem) => {
      if (cartItem.item_id === item.item_id) {
        cartItem.quantity_in_cart += 1;
      }
      return cartItem;
    });
    setCart(newCart);
    saveCartToLocalStorage(cart);
    debounceSyncCart(cart);
  };

  const clearCart = () => {
    setCart([]);
    saveCartToLocalStorage([]);
  };

  useEffect(() => {
    const fetchCart = async () => {
      const localCart = localStorage.getItem("cart");
      if (!localCart || localCart === "undefined") {
        return;
      }
      try {
        setCart(JSON.parse(localCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        setCart([]);
      }
    };

    fetchCart();
    debounceSyncCart(cart);
  }, []);

  useEffect(() => {
    syncCart(cart);
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseItemNo,
        reduceItemNo,
        syncCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
