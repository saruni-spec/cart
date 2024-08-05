"use client";
import React, { useState } from "react";
import LoginComponent from "../components/LoginComponent";
import SignUpComponent from "../components/SignUpComponent";
import { useUser } from "../contexts/UserContext";

const SignInComponent = ({ currentPage }) => {
  const { signIn } = useUser();
  const [page, setPage] = useState("login");
  const [message, setMessage] = useState("");

  const getUser = async (Data, ROUTE) => {
    const results = await signIn(Data, ROUTE);
    setMessage(results);
  };

  return (
    <div className={currentPage === "signup" ? "signUp" : "promptSignUp"}>
      {message && <p>{message}</p>}
      {page === "login" ? (
        <>
          <LoginComponent signIn={getUser} />
          <button onClick={() => setPage("signup")}>Sign Up</button>
        </>
      ) : (
        <>
          <SignUpComponent signIn={getUser} />
          <button onClick={() => setPage("login")}>Login</button>
        </>
      )}
    </div>
  );
};

export default SignInComponent;
