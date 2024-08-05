"use client";

import React, { useState } from "react";
import ItemList from "../../components/ItemsList";
import { useSearchParams } from "next/navigation";
import { addFormToDatabase } from "../../myFunctions/funtions";

const AddItemsToShopInventory = () => {
  const ROUTE = "inventory";

  const [refresh, setRefresh] = useState(true);
  const [message, setMessage] = useState("");
  const [selecteditem, setSelecteditem] = useState(null);
  const selectItem = (item) => {
    setSelecteditem(item);
  };

  const searchParams = useSearchParams();

  const shop_id = searchParams.get("shop_id");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selecteditem) {
      alert("Please select item to add");
      return;
    }
    if (!shop_id) {
      return;
    }

    const formData = new FormData(e.target);
    const Data = Object.fromEntries(formData);
    Data.shop_id = shop_id;
    Data.item_id = selecteditem.item_id;

    console.log(Data, ROUTE);
    const results = await addFormToDatabase(Data, ROUTE);
    setMessage(results.message);
    e.target.reset(); // Reset the form
  };
  return (
    <>
      <ItemList
        selectItem={selectItem}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      {selecteditem && (
        <form onSubmit={handleSubmit}>
          <label>
            {selecteditem.name}-{selecteditem.brand}-{selecteditem.type}
          </label>
          <label>
            <input placeholder="quantity" name="quantity" />
          </label>
          <label>
            <input placeholder="price" name="price" />
          </label>
          <button type="submit">Add Item</button>
          {message && <p>{message}</p>}
        </form>
      )}
    </>
  );
};

export default AddItemsToShopInventory;
