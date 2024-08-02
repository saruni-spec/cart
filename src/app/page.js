import React from "react";
import ShopList from "./components/ShopList";

export default function Home() {
  const shopRoute = "shops";
  return (
    <>
      <div>
        <h1>Home</h1>
        <p>Welcome to the home page</p>
      </div>

      <ShopList nextRoute={shopRoute} />

      <div>More Information about Us</div>
    </>
  );
}
