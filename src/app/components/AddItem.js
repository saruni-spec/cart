"use client";
import React, { useEffect, useState } from "react";
import {
  addFormToDatabase,
  fetchItemsFromDatabase,
  updateItemInDatabase,
} from "../myFunctions/funtions";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";

const AddItem = ({ setRefresh }) => {
  const ROUTE = "item";
  const CATEGORYROUTE = "category";
  const [message, setMessage] = useState(null);
  const [categories, setCategories] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Add item to database without image URL
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      const results = await addFormToDatabase(data, ROUTE);

      const itemId = results.DataFetched.item_id;

      // Step 2: Upload image and get URL
      const storageRef = ref(storage, `items/${itemId}`);
      await uploadBytes(storageRef, data.image_url);
      const downloadURL = await getDownloadURL(storageRef);

      // Step 3: Update database record with image URL
      const updateResult = await updateItemInDatabase(
        { field: "image_url", value: downloadURL, id: itemId },
        ROUTE
      );

      setMessage(updateResult.message || results.message);
      e.target.reset();
      setRefresh(true);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setMessage("An error occurred while submitting the form.");
    }
  };
  const getCategories = async (route) => {
    const categories = await fetchItemsFromDatabase(CATEGORYROUTE);
    console.log(categories, "my categories");
    setCategories(categories.DataFetched);
    setMessage(categories.message);
  };

  useEffect(() => {
    getCategories(CATEGORYROUTE);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="addItems">
      <label>
        <select required name="category_id">
          <option value="">Select Category</option>
          {categories ? (
            categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))
          ) : (
            <></>
          )}
        </select>
      </label>
      <label>
        <input required placeholder="name" name="name" />
      </label>
      <label>
        <input required placeholder="brand" name="brand" />
      </label>
      <label>
        <input required placeholder="type" name="type" />
      </label>
      <label>
        <input required placeholder="Size" name="size" />
      </label>
      <label>
        <input required placeholder="Unit Measurement" name="measurement" />
      </label>
      <label>
        <input placeholder="description" name="description" />
      </label>
      <label>
        <input required type="file" name="image_url" />
      </label>
      <button type="submit">Add Item</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default AddItem;
