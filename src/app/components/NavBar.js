import React from "react";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav>
      <ul className="navBar">
        <li>
          <Link href={"/"}>Home</Link>
        </li>
        <li>
          <Link href={"/shop"}>Shop</Link>
        </li>
        <li>
          <Link href={"/cart"}>Cart</Link>
        </li>
        <li>
          <label>
            <input></input>
          </label>
        </li>

        <li>
          <Link href={"/signup"}>Sign In</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
