import React, { useState } from "react";

const AddShop = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear any previous messages

    const formData = new FormData(e.target);
    const shopData = Object.fromEntries(formData);

    try {
      const response = await fetch("/api/shops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shopData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to add shop: ${response.status} ${
            response.statusText
          }. ${JSON.stringify(errorData)}`
        );
      }

      const result = await response.json();
      setMessage("Shop added successfully!");
      e.target.reset(); // Reset the form
    } catch (error) {
      console.error("Error adding shop:", error.message);
      setMessage(
        `Failed to add shop. Please try again. Error: ${error.message}`
      );
    }
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
