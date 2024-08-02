"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Shop() {
  const [items, setItems] = useState([]);

  const searchParams = useSearchParams();

  const shop_id = searchParams.get("shop_id");

  useEffect(() => {
    async function fetchItems() {
      const response = await fetch(`/api/inventory?shop_id=${shop_id}`);
      const data = await response.json();
      setItems(data);
      console.log(data, "this is the data");
    }
    fetchItems();
  }, [shop_id]);

  return (
    <>
      <ul>
        {items ? (
          <>
            {items.map((item) => (
              <li key={item.item_id}>
                <Link href={`/shops/items/${item.item_id}`}>{item.name}</Link>
              </li>
            ))}
          </>
        ) : (
          <>No Items in shop</>
        )}
      </ul>
    </>
  );
}
