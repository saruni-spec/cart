"use client";
import { useQuery } from "react-query";
import { useSearchParams } from "next/navigation";
import { fetchItemsFromDatabase } from "../../myFunctions/funtions";
import { useCart } from "../../contexts/CartContext";
import Image from "next/image";

export default function Shop() {
  const searchParams = useSearchParams();
  const shop_id = searchParams.get("shop_id");
  const GETITEMSROUTE = `inventory?shop_id=${shop_id}`;
  const { cart, addToCart } = useCart();

  const { data, isLoading, error } = useQuery(
    [cart, shop_id], // Include cart in the query key
    () => fetchItems(cart, GETITEMSROUTE),
    {
      staleTime: 180000,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>An error occurred: {error.message}</p>;

  const { items, message } = data || {};

  return (
    <>
      <ul className="itemList">
        {items && items.length > 0 ? (
          items.map((item) => (
            <li key={item.item_id}>
              <p>
                {item.name} ({item.type}-{item.brand})
              </p>
              <p>
                {item.size} {item.measurement}
              </p>
              <Image
                src={`${item.image_url}`}
                alt={`${item.name}${item.brand}`}
                width={50}
                height={50}
              />
              <p>{item.price}</p>
              {!item.addedToCart ? (
                <button onClick={() => addToCart(item)}>Add to Cart</button>
              ) : (
                <p>Item added</p>
              )}
            </li>
          ))
        ) : (
          <p>{message}</p>
        )}
      </ul>
    </>
  );
}

async function fetchItems(cart, route) {
  const results = await fetchItemsFromDatabase(route);
  const data = results.DataFetched;
  const message = results.message;

  console.log(cart, "cart cheking in shop");
  if (cart.length > 0) {
    console.log(cart, "we have a cart");
    const cartItemsSet = new Set(cart.map((item) => item.item_id));
    const updatedItems = data.map((item) => ({
      ...item,
      addedToCart: cartItemsSet.has(item.item_id),
    }));
    return { items: updatedItems, message: message };
  }

  return { items: data, message: message };
}
