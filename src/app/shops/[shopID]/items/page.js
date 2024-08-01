import { useEffect, useState } from "react";

export default function Item({ params }) {
  const [item, setItem] = useState([]);
  const item_id = params.item_id;

  const addToCart = async () => {};
  async function fetchItems() {
    const data = "fetch item";
    setItem(data);
  }

  useEffect(() => {
    fetchItems();
  }, [item, item_id]);

  return (
    <div>
      {item.map((item) => (
        <div key={item.item_id}>
          <h2>{item.name}</h2>
          <p>{item.price}</p>
          <p>{item.description}</p>
        </div>
      ))}
      <button onClick={addToCart}>Add to cart</button>
    </div>
  );
}
