"use client";
import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const signIn = async (data, route) => {
    // Your sign in logic here
    const newToken = await addFormToDatabase(data, route);
    setToken(newToken.DataFetched);
    localStorage.setItem("token", newToken);
    return newToken.message;
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
