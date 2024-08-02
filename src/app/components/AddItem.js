"use client";
import React, { useState } from "react";
import { addFormToDatabase } from "../myFunctions/funtions";

const AddItem = ({ setRefresh }) => {
  const ROUTE = "item";
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const Data = Object.fromEntries(formData);
    addFormToDatabase(Data, ROUTE, setMessage);
    setRefresh(true);
  };

  return (
    <form onSubmit={handleSubmit} className="addItems">
      <label>
        <input placeholder="category" name="category" />
      </label>
      <label>
        <input placeholder="name" name="name" />
      </label>
      <label>
        <input placeholder="quality" name="quality" />
      </label>
      <label>
        <input placeholder="brand" name="brand" />
      </label>
      <label>
        <input placeholder="type" name="type" />
      </label>
      <label>
        <input placeholder="quantity" name="quantity" />
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
