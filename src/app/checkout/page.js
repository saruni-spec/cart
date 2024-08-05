import React from "react";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import SignInComponent from "../components/SignInComponent";

const CheckOut = () => {
  const { cart } = useCart();
  const { token } = useUser();

  return (
    <>
      {token ? (
        <div>
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
                </li>
              ))
            ) : (
              <>Add items to your Cart</>
            )}
          </ul>
          <button>Pick Up Items</button>
          <button>Delivery</button>
        </div>
      ) : (
        <SignInComponent currentPage={"checkout"} />
      )}
    </>
  );
};

export default CheckOut;
