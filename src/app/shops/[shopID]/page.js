"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { debounce } from "../../myFunctions/funtions";

export default function Shop() {
  const [items, setItems] = useState([]);

  const searchParams = useSearchParams();

  const shop_id = searchParams.get("shop_id");

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));

    // Debounce this function to avoid too frequent server calls
    debouncedSyncCart();
    console.log("added to cart", item);
  };

  const syncCart = async () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({ cart }),
      headers: { "Content-Type": "application/json" },
    });
  };

  const debouncedSyncCart = debounce(syncCart, 10000); // Sync after 5 seconds of inactivity

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
      <ul className="itemList">
        {items ? (
          <>
            {items.map((item) => (
              <li key={item.item_id} onClick={() => addToCart(item)}>
                <p>{item.name}</p>
                <p>Quantity: {JSON.stringify(item.quantity)}</p>
                <p>{item.brand}</p>
                <p>Type:{item.type}</p>
                <p>{item.description}</p>
                <p>{item.image_url}</p>
                <p>{item.price}</p>
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
