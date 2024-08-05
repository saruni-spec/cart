"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchItemsFromDatabase } from "../../myFunctions/funtions";
import { useCart } from "../../contexts/CartContext";

export default function Shop() {
  const searchParams = useSearchParams();
  const shop_id = searchParams.get("shop_id");
  const GETITEMSROUTE = `inventory?shop_id=${shop_id}`;
  const [items, setItems] = useState([]);
  const { cart, addToCart } = useCart();

  useEffect(() => {
    async function fetchItems() {
      const data = await fetchItemsFromDatabase(GETITEMSROUTE);
      const storedCart = cart;
      const cartItemsSet = new Set(storedCart.map((item) => item.item_id));
      const updatedItems = data.map((item) => ({
        ...item,
        addedToCart: cartItemsSet.has(item.item_id),
      }));
      setItems(updatedItems);
      localStorage.setItem("shop_id", shop_id);
    }
    fetchItems();
  }, [GETITEMSROUTE, shop_id, cart]);

  return (
    <>
      <ul className="itemList">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.item_id}>
              <p>
                {item.name} ({item.type}-{item.brand})
              </p>
              <p>
                {item.size} {item.measurement}
              </p>
              <p>{item.image_url}</p>
              <p>{item.price}</p>
              {!item.addedToCart ? (
                <button onClick={() => addToCart(item)}>Add to Cart</button>
              ) : (
                <p>Item added</p>
              )}
            </li>
          ))
        ) : (
          <p>No Items in shop</p>
        )}
      </ul>
    </>
  );
}
