"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const ShopList = ({ nextRoute }) => {
  const [shops, setShops] = useState([]);

  async function getShops() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shop`);
    if (!res.ok) {
      throw new Error("Failed to fetch shops");
    }
    const shopsData = await res.json();
    setShops(shopsData);
  }

  useEffect(() => {
    getShops();
  }, []);

  return (
    <ul>
      {shops &&
        shops.map((shop) => (
          <li key={shop.shop_id}>
            <Link
              href={`/${nextRoute}/${shop.shop_id}?shop_id=${shop.shop_id}`}
            >
              {shop.name}
            </Link>
          </li>
        ))}
      {!shops && <>No shops Available</>}
    </ul>
  );
};

export default ShopList;
