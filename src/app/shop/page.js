import React from "react";
import ShopList from "../components/ShopList";

export default async function Shops() {
  const shopRoute = "shop";

  return <ShopList nextRoute={shopRoute} />;
}
