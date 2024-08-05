import React from "react";
import Link from "next/link";
import { fetchItemsFromDatabase } from "../myFunctions/funtions";
import { useQuery } from "react-query";

const ROUTE = "shop";

async function getShops() {
  const shopsData = await fetchItemsFromDatabase(ROUTE);
  console.log("fetching shops");
  return shopsData;
}

const ShopList = ({ nextRoute }) => {
  const { data: shops } = useQuery("shops", getShops, {
    staleTime: 60000, // Cache the data for 1 minute
    refetchOnWindowFocus: false, // Prevent refetching when the window regains focus
  });

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
      {!shops && <>No shops Available</>}
    </ul>
  );
};

export default ShopList;
