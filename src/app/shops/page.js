import React from "react";
import Link from "next/link";

async function getShops() {
  const shops = "get shops api";
  return shops;
}

export default async function Shops() {
  const shops = await getShops();

  return (
    <ul>
      {shops.map((shop) => (
        <li key={shop.shop_id}>
          <Link href={`/shops/${shop.shop_id}`}>{shop.name}</Link>
        </li>
      ))}
    </ul>
  );
}
