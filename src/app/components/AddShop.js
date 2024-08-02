import React, { useState } from "react";
import { addFormToDatabase } from "../myFunctions/funtions";

const AddShop = () => {
  const ROUTE = "shop";
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const Data = Object.fromEntries(formData);
    addFormToDatabase(Data, ROUTE, setMessage);
    e.target.reset(); // Reset the form
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Shop Name:
          <input required type="text" name="name" />
        </label>
        <label>
          Location:
          <input required type="text" name="location" />
        </label>
        <label>
          Email:
          <input required type="email" name="email" />
        </label>
        <label>
          Phone:
          <input required type="tel" name="phone" />
        </label>
        <button type="submit">Add Shop</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddShop;
