"use client";
import React, { useState } from "react";
import { addFormToDatabase } from "../myFunctions/funtions";

const SignUp = () => {
  const ROUTE = "buyer";
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const Data = Object.fromEntries(formData);
    addFormToDatabase(Data, ROUTE, setMessage);
    e.target.reset(); // Reset the form
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <input required type="text" placeholder="First Name" name="firstname" />
      </label>
      <label>
        <input required type="text" placeholder="Last Name" name="lastname" />
      </label>
      <label>
        <input required type="email" placeholder="email" name="email" />
      </label>
      <label>
        <input required type="number" placeholder="Phone Number" name="phone" />
      </label>
      <label>
        <input type="text" placeholder="address 1" name="location" />
      </label>
      <label>
        <input type="text" placeholder="address 2" name="address" />
      </label>
      <label>
        <input
          required
          type="password"
          placeholder="password"
          name="password"
        />
      </label>
      <label>
        <input required type="password" placeholder="confirm password" />
      </label>

      <button type="submit">Sign Up</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default SignUp;
