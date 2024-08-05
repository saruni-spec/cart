import React from "react";

const LoginComponent = ({ signIn }) => {
  const LOGINROUTE = "buyer/login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const Data = Object.fromEntries(formData);
    await signIn(Data, LOGINROUTE);
    e.target.reset(); // Reset the form
  };

  return (
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
    </form>
  );
};

export default LoginComponent;
