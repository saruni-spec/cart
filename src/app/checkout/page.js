"use client";
import React, { useEffect, useState } from "react";

const CheckOut = () => {
  const [order, setOrder] = useState([]);

  const getCartFromLocalStorage = () => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    console.log("cart page");
    if (!cart) {
      return;
    }
    setOrder(cart);
  };

  useEffect(() => {
    const getCartFromDatabase = async () => {
      const token = localStorage.getItem("token" || null);
      if (!token) {
        getCartFromLocalStorage();
        setIsLoggedIn(false);
        return;
      }
      const myCart = await fetchItemsFromDatabase(ROUTE, token);
      if (!myCart || myCart.length === 0) {
        getCartFromLocalStorage();
        return;
      }

      setOrder(myCart);
    };
    console.log("cart page 1");
    getCartFromDatabase();
    console.log("cart page 2");
  }, []);
  return (
    <>
      <div>
        <ul>
          {order.length > 0 ? (
            order.map((item) => (
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
              </li>
            ))
          ) : (
            <>Add items to your Cart</>
          )}
        </ul>
        <button>Pick Up Items</button>
        <button>Delivery</button>
      </div>
      <></>
    </>
  );
};

export default CheckOut;
