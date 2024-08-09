"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import SignInComponent from "../components/SignInComponent";

import { useRouter } from "next/navigation";

const CheckOut = () => {
  const { cart, clearCart } = useCart();
  const { token, signOut } = useUser();

  const router = useRouter();

  const handleSignOut = () => {
    clearCart();
    signOut();
    router.push("/", { scroll: false });
  };

  return (
    <>
      <button onClick={handleSignOut}>Log Out</button>
      {token ? (
        <div>
          {cart && cart.length > 0 ? (
            <>
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

                    <p>{item.image_url}</p>
                    <p>{item.quantity_in_cart}</p>
                  </li>
                ))}
              </ul>
              <button>Delivery</button>
              <button>Pick Up</button>
            </>
          ) : (
            <>Add items to your Cart</>
          )}
        </div>
      ) : (
        <SignInComponent currentPage={"checkout"} />
      )}
    </>
  );
};

export default CheckOut;
