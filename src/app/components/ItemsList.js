import React from "react";
import PropTypes from "prop-types";
import { fetchItemsFromDatabase } from "../myFunctions/funtions";
import { useQuery } from "react-query";
import Image from "next/image";

const ROUTE = "item";

async function getItems() {
  const itemsData = await fetchItemsFromDatabase(ROUTE);
  console.log("fetching items");
  return { items: itemsData.DataFetched, message: itemsData.message };
}

const ItemList = ({ refresh, setRefresh, selectItem = () => {} }) => {
  const { data, isLoading, error } = useQuery("items", getItems, {
    staleTime: 180000, // Cache the data for 1 minute
    refetchOnWindowFocus: false, // Prevent refetching when the window regains focus
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>An error occurred: {error.message}</p>;
  const { items, message } = data || {};

  return (
    <ul className="itemList">
      {items ? (
        items.map((item) => (
          <li key={item.item_id} onClick={() => selectItem(item)}>
            <p>
              {item.name}({item.type})-{item.brand}
            </p>
            <p>
              Size : {item.size}
              {item.measurement}
            </p>
            <p>{item.description}</p>

            <Image
              src={`${item.image_url}`}
              alt={`${item.name}${item.brand}`}
              width={50}
              height={50}
            />
          </li>
        ))
      ) : (
        <p>{message}</p>
      )}
    </ul>
  );
};

ItemList.propTypes = {
  refresh: PropTypes.bool,
  setRefresh: PropTypes.func,
  selectItem: PropTypes.func,
};

export default ItemList;
