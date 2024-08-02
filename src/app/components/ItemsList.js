"use client";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const ItemList = ({ refresh, setRefresh, selectItem = () => {} }) => {
  const [items, setItems] = useState([]);

  async function getItems() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items`);
    if (!res.ok) {
      throw new Error("Failed to fetch items");
    }
    const itemsData = await res.json();
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
            <p>{item.name}</p>
            <p>{item.brand}</p>
            <p>{item.quality}</p>
            <p>Quantity: {JSON.stringify(item.quantity)}</p>
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
