"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { addFormToDatabase } from "../myFunctions/funtions";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const signIn = async (data, route) => {
    // Your sign in logic here
    const results = await addFormToDatabase(data, route);
    const newToken = results.DataFetched;
    setToken(newToken);
    localStorage.setItem("token", newToken);
    return results;
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <UserContext.Provider value={{ user, token, signIn, signOut, checkToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
