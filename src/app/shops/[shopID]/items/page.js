import { useEffect, useState } from "react";
import Link from "next/link";

export default function ItemList({ params }) {
  const [items, setItems] = useState([]);
  const shopId = params.shopId;

  useEffect(() => {
    async function fetchItems() {
      const response = await fetch(`/api/i?shop_id=${shopId}`);
      const data = await response.json();
      setItems(data);
    }
    fetchItems();
  }, [items, shopId]);

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <Link href={`/shops/items/${shop.id}`}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}
