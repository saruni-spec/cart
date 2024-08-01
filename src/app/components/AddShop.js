import React from "react";

const AddShop = () => {
  return (
    <form>
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
    </form>
  );
};

export default AddShop;
