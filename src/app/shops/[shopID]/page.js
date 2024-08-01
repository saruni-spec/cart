"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Shop({ params }) {
  const [items, setItems] = useState([]);
  const shop_id = params.shop_id;

  useEffect(() => {
    async function fetchItems() {
      const data = "fetch items in shop";
      setItems(data);
    }
    fetchItems();
  }, [items, shop_id]);

  return (
    <ul>
      {items.map((item) => (
        <li key={item.item_id}>
          <Link href={`/shops/items/${item.item_id}`}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}
