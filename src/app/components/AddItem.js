"use client";
import React, { useEffect, useState } from "react";
import {
  addFormToDatabase,
  fetchItemsFromDatabase,
} from "../myFunctions/funtions";

const AddItem = ({ setRefresh }) => {
  const ROUTE = "item";
  const CATEGORYROUTE = "category";
  const [message, setMessage] = useState(null);
  const [categories, setCategories] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Restructure the data
    const restructuredData = {
      ...data,
      quantity: {
        small: data.small || "",
        medium: data.medium || "",
        large: data.large || "",
      },
    };

    // Remove the individual size fields
    delete restructuredData.small;
    delete restructuredData.medium;
    delete restructuredData.large;
    console.log(restructuredData, "restructuredData");
    addFormToDatabase(restructuredData, ROUTE, setMessage);
    e.target.reset();
    setRefresh(true);
  };

  const getCategories = async (route) => {
    const categories = await fetchItemsFromDatabase(CATEGORYROUTE);
    console.log(categories, "my categories");
    setCategories(categories);
  };

  useEffect(() => {
    getCategories(CATEGORYROUTE);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="addItems">
      <label>
        <select name="category">
          <option value="">Select Category</option>
          {categories &&
            categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
        </select>
      </label>
      <label>
        <input placeholder="name" name="name" />
      </label>
      <label>
        <input placeholder="brand" name="brand" />
      </label>
      <label>
        <input placeholder="type" name="type" />
      </label>
      <label>
        <input placeholder="small" name="small" />
        <input placeholder="medium" name="medium" />
        <input placeholder="large" name="large" />
      </label>
      <label>
        <input placeholder="description" name="description" />
      </label>
      <label>
        <input placeholder="image" name="image" />
      </label>
      <button type="submit">Add Item</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default AddItem;
