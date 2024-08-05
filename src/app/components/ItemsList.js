"use client";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { fetchItemsFromDatabase } from "../myFunctions/funtions";

const ItemList = ({ refresh, setRefresh, selectItem = () => {} }) => {
  const ROUTE = "item";
  const [items, setItems] = useState([]);

  async function getItems() {
    const itemsData = await fetchItemsFromDatabase(ROUTE);

    console.log("getting items");
    setItems(itemsData);
  }

  useEffect(() => {
    if (refresh) {
      getItems();
      setRefresh(false);
    }
  }, []);

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
