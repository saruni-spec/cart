import { useEffect, useState } from "react";

export default function ItemList({ params }) {
  const [items, setItems] = useState([]);
  const shopId = params.shopId;

  useEffect(() => {
    async function fetchItems() {
      const response = await fetch(`/api/items?shop_id=${shopId}`);
      const data = await response.json();
      setItems(data);
    }
    fetchItems();
  }, [items, shopId]);

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
