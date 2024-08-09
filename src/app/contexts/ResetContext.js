import React from "react";
import { useUser } from "./UserContext";
import { useCart } from "./CartContext";

const ResetAllContexts = () => {
  const { signOut } = useUser();
  const { clearCart } = useCart();

  const resetAll = () => {
    signOut();
    clearCart();
    router.push("/", { scroll: false });
  };

  return <button onClick={resetAll}>Sign Out</button>;
};
export default ResetAllContexts;
