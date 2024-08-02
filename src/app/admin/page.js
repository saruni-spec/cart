"use client";

import AddShop from "../components/AddShop";
import ShopList from "../components/ShopList";

import { useState } from "react";
import AddItems from "./addItems/page";

export default function AdminPanel() {
  const [page, setPage] = useState("");
  const ROUTE = "admin";

  return (
    <div>
      <button type="button" onClick={() => setPage("")}>
        Admin
      </button>
      {page === "" && (
        <>
          <h1>Admin Panel</h1>
          <button type="button" onClick={() => setPage("addShop")}>
            Add Shop
          </button>
          <button type="button" onClick={() => setPage("addItems")}>
            Add Items
          </button>
          <button type="button" onClick={() => setPage("inventory")}>
            Update Inventory
          </button>
        </>
      )}

      {page === "addShop" && <AddShop />}
      {page === "addItems" && <AddItems />}
      {page === "inventory" && <ShopList nextRoute={ROUTE} />}
    </div>
  );
}
