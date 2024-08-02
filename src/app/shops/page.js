import React from "react";
import Link from "next/link";
import ShopList from "../components/ShopList";

export default async function Shops() {
  const shopRoute = "shops";

  return <ShopList shops={shopRoute} />;
}
