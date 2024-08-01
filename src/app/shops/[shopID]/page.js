import { useEffect, useState } from "react";
import Link from "next/link";

export default function ItemList({ params }) {
  const [items, setItems] = useState([]);
  const shop_id = params.shop_id;

  useEffect(() => {
    async function fetchItems() {
      const response = await fetch(`/api/items?shop_id=${shop_id}`);
      const data = await response.json();
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
