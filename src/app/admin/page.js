"use client";

import AddShop from "../components/AddShop";
import UpdateInventory from "../components/UpdateInventory";
import { useState } from "react";

export default function AdminPanel() {
  const [page, setPage] = useState("");

  const changePage = (page) => {
    setPage(page);
  };
  return (
    <div>
      {page === "" && (
        <>
          <h1>Admin Panel</h1>
          <button type="button" onClick={() => changePage("addShop")}>
            Add Shop
          </button>
          <button type="button" onClick={() => changePage("inventory")}>
            Update Inventory
          </button>
        </>
      )}

      {page === "addShop" && <AddShop />}
      {page === "inventory" && <UpdateInventory />}
    </div>
  );
}
