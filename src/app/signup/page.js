"use client";
import React, { useState } from "react";
import {
  addFormToDatabase,
  fetchItemsFromDatabase,
} from "../myFunctions/funtions";

const SignUp = () => {
  const SIGNUPROUTE = "buyer/signup";
  const [message, setMessage] = useState("");
  const [page, setPage] = useState("login");
  const [buyer, setBuyer] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const Data = Object.fromEntries(formData);
    if (page === "login") {
      localStorage.setItem(
        "token",
        await addFormToDatabase(Data, LOGINROUTE, setMessage)
      );
    } else {
      localStorage.setItem(
        "token",
        await addFormToDatabase(Data, SIGNUPROUTE, setMessage)
      );
    }
    e.target.reset(); // Reset the form}
  };

  return (
    <div>
      {message && <p>{message}</p>}
      {page === "login" ? (
        <>
          <form onSubmit={handleSubmit}>
            <label>
              <input required type="email" placeholder="email" name="email" />
            </label>
            <label>
              <input
                required
                type="password"
                placeholder="password"
                name="password"
              />
            </label>
            <button type="submit">Login</button>
            {message && <p>{message}</p>}
          </form>
          <button onClick={() => setPage("signup")}>Sign Up</button>
        </>
      ) : (
        <>
          {" "}
          <form onSubmit={handleSubmit}>
            <label>
              <input
                required
                type="text"
                placeholder="First Name"
                name="firstname"
              />
            </label>
            <label>
              <input
                required
                type="text"
                placeholder="Last Name"
                name="lastname"
              />
            </label>
            <label>
              <input required type="email" placeholder="email" name="email" />
            </label>
            <label>
              <input
                required
                type="number"
                placeholder="Phone Number"
                name="phone"
              />
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
          </form>
          <button onClick={() => setPage("login")}>Login</button>
        </>
      )}
    </div>
  );
};

export default SignUp;
