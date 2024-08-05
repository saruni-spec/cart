import React from "react";
import PropTypes from "prop-types";
import { fetchItemsFromDatabase } from "../myFunctions/funtions";
import { useQuery } from "react-query";

const ROUTE = "item";

async function getItems() {
  const itemsData = await fetchItemsFromDatabase(ROUTE);
  console.log("fetching items");
  return itemsData;
}

const ItemList = ({ refresh, setRefresh, selectItem = () => {} }) => {
  const { data: items } = useQuery("items", getItems, {
    staleTime: 60000, // Cache the data for 1 minute
    refetchOnWindowFocus: false, // Prevent refetching when the window regains focus
  });

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

            <p>{item.image_url}</p>
          </li>
        ))
      ) : (
        <>No items have been added</>
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
