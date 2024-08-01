// pages/api/items.js
import pool from "@/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { cart_id } = req.query; // Extract shop_id from query parameters

  if (!cart_id) {
    return res.status(400).json({ error: "cart_id is required" });
  }

  try {
    const { rows } = await pool.query(
      "SELECT * FROM cart_item WHERE cart_id = $1",
      [cart_id]
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching cart items" },
      { status: 500 }
    );
  }
}

export async function POST(req, res) {
  try {
    const body = await req.json();
    const { Item_ID, Quantity, Price } = body;
    const query = `
      INSERT INTO cart_items (Item_ID ,
    Quantity ,
    Price ,

    
) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const values = [Item_ID, Quantity, Price];

    const { rows } = await pool.query(query, values);
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error adding cart_items:", error);
    return NextResponse.json(
      { error: "Error adding cart_items" },
      { status: 500 }
    );
  }
}
