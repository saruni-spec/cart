// pages/api/inventory.js
import pool from "@/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const shop_id = searchParams.get("shop_id");

  if (!shop_id) {
    return NextResponse.json(
      {
        error: "shop_id is required",
        message: "URL not Found",
        DataFetched: null,
      },
      { status: 400 }
    );
  }

  try {
    const query = `
      SELECT i.*, iv.*
FROM item i
JOIN inventory iv ON iv.item_id = i.item_id
WHERE iv.shop_id = $1;

    `;

    const { rows } = await pool.query(query, [shop_id]);

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Shop Inventory Empty", DataFetched: [] },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Inventory Loaded", DataFetched: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return NextResponse.json(
      {
        error: "Error fetching inventory items",
        message: "Error getting Inventory,Try again",
        DataFetched: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { item_id, shop_id, quantity, price } = body;

    // Check if the item already exists in the database
    const checkQuery = `
      SELECT * 
      FROM inventory
      WHERE item_id = $1 AND shop_id = $2
    `;
    const checkValues = [item_id, shop_id];
    const { rows: existingItem } = await pool.query(checkQuery, checkValues);

    if (existingItem.length > 0) {
      // If the item already exists, update the existing record
      const updateQuery = `
        UPDATE inventory
        SET inventory_quantity = $3, price = $4
        WHERE item_id = $1 AND shop_id = $2
        RETURNING *
      `;
      const updateValues = [item_id, shop_id, quantity, price];
      const { rows } = await pool.query(updateQuery, updateValues);

      return NextResponse.json(
        { message: "Inventory Updated", DataFetched: rows[0] },
        { status: 201 }
      );
    } else {
      // If the item doesn't exist, insert a new record
      const insertQuery = `
        INSERT INTO inventory (item_id, shop_Id, inventory_quantity, price)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const insertValues = [item_id, shop_id, quantity, price];
      const { rows } = await pool.query(insertQuery, insertValues);

      return NextResponse.json(
        { message: "Inventory Updated", DataFetched: rows[0] },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error adding item to inventory:", error);
    return NextResponse.json(
      {
        error: "Error adding item to inventory",
        message: "Error adding Item,Try Again",
        DataFetched: [],
      },
      { status: 500 }
    );
  }
}
