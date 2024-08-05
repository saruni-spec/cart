"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  addFormToDatabase,
  debounce,
  fetchItemsFromDatabase,
} from "../../myFunctions/funtions";

export default function Shop() {
  const searchParams = useSearchParams();
  const shop_id = searchParams.get("shop_id");
  const SAVETOCARTROUTE = `cart/buyer`;
  const GETITEMSROUTE = `inventory?shop_id=${shop_id}`;
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState(null);
  const [token, setToken] = useState(null);
  const [cart, setCart] = useState([]);

  const getCart = useCallback(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
    return storedCart;
  }, []);

  const cartItemsMap = useMemo(() => {
    return new Map(cart.map((item) => [item.item_id, item]));
  }, [cart]);

  const addToCart = useCallback(
    (item) => {
      if (cartItemsMap.has(item.item_id)) {
        return;
      }
      const newItem = { ...item, quantity: 1, addedToCart: true };
      const updatedCart = [...cart, newItem];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setItems((prev) =>
        prev.map((i) =>
          i.item_id === item.item_id ? { ...i, addedToCart: true } : i
        )
      );
      debouncedSyncCart();
    },
    [cart, cartItemsMap]
  );

  const syncCart = useCallback(async () => {
    if (!token) return;
    const cartItems = { cartItems: cart, shop_id: shop_id };
    await addFormToDatabase(cartItems, SAVETOCARTROUTE, setMessage, token);
    setMessage(null);
  }, [cart, shop_id, token]);

  const debouncedSyncCart = useMemo(
    () => debounce(syncCart, 10000),
    [syncCart]
  );

  useEffect(() => {
    async function fetchItems() {
      const data = await fetchItemsFromDatabase(GETITEMSROUTE);
      const storedCart = getCart();
      const cartItemsSet = new Set(storedCart.map((item) => item.item_id));
      const updatedItems = data.map((item) => ({
        ...item,
        addedToCart: cartItemsSet.has(item.item_id),
      }));
      setItems(updatedItems);
      localStorage.setItem("shop_id", shop_id);
      const storedToken = localStorage.getItem("token") || null;
      setToken(storedToken);
    }
    fetchItems();
  }, [GETITEMSROUTE, shop_id, getCart]);

  return (
    <>
      {message && <p>{message}</p>}
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
