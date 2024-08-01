import React from "react";
import Link from "next/link";

async function getShops() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shops`);
  if (!res.ok) {
    throw new Error("Failed to fetch shops");
  }
  return res.json();
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
