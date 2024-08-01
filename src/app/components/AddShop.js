import React from "react";

const AddShop = () => {
  const handleSubmit = () => {};

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <input required type="text" name="shopName" />
      </label>
      <label>
        <input required type="text" name="location" />
      </label>
      <label>
        <input required type="email" name="email" />
      </label>
      <label>
        <input required type="number" name="phone" />
      </label>
      <button type="submit">Add shop</button>
    </form>
  );
};

export default AddShop;
