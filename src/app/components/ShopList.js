"use client";
import React from "react";
import Link from "next/link";
import { fetchItemsFromDatabase } from "../myFunctions/funtions";
import { useQuery } from "react-query";

const ROUTE = "shop";

async function getShops() {
  const shopsData = await fetchItemsFromDatabase(ROUTE);
  console.log("fetching shops");
  return { shops: shopsData.DataFetched, message: shopsData.message };
}

const ShopList = ({ nextRoute }) => {
  const { data, error, isLoading } = useQuery("shops", getShops, {
    staleTime: 180000, // Cache the data for 1 minute
    refetchOnWindowFocus: false, // Prevent refetching when the window regains focus
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>An error occurred: {error.message}</p>;

  const { shops, message } = data || {};
  return (
    <ul>
      {shops &&
        shops.map((shop) => (
          <li key={shop.shop_id}>
            <Link
              href={`/${nextRoute}/${shop.shop_id}?shop_id=${shop.shop_id}`}
            >
              {shop.name}
            </Link>
          </li>
        ))}
      {!shops && <p>{message}</p>}
    </ul>
  );
};

export default ShopList;
