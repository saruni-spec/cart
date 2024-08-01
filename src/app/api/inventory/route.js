// pages/api/items.js
import pool from "@/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { shop_id } = req.query; // Extract shop_id from query parameters

  if (!shop_id) {
    return NextResponse.json({ error: "shop_id is required" }, { status: 400 });
  }

  try {
    const query = `
      SELECT i.item_id, i.name, i.quality, i.brand, i.type, i.price, i.description, i.image_url, inv.quantity
      FROM INVENTORY inv
      JOIN ITEM i ON inv.item_id = i.item_id
      WHERE inv.shop_id = $1
    `;

    const { rows } = await pool.query(query, [shop_id]);

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "No items found for this shop" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return NextResponse.json(
      { error: "Error fetching inventory items" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { shopId, quantity, price } = body;

    const query = `
      INSERT INTO inventory (Shop_Id,Quantity,Price) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const values = [shopId, quantity, price];

    const { rows } = await pool.query(query, values);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Error adding item to inventory:", error);
    return NextResponse.json(
      { error: "Error adding item to inventory" },
      { status: 500 }
    );
  }
}
