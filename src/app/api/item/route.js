// pages/api/item.js
import pool from "@/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { rows } = await pool.query("SELECT * FROM item ");

    if (rows.length === 0) {
      return NextResponse.json(
        null,
        { message: "Items not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json({ error: "Error fetching item" }, { status: 500 });
  }
}

export async function POST(req, res) {
  try {
    const body = await req.json();
    const { category_id, name, brand, type, quantity, description, image_url } =
      body;

    const query = `
      INSERT INTO item ( 
      category_id,
    name,
    brand,
    type,
    quantity,
    description,
    image_url
) 
      VALUES ($1, $2, $3,$4,$5,$6,$7) 
      RETURNING *
    `;
    const values = [
      category_id,
      name,

      brand,
      type,
      quantity,

      description,
      image_url,
    ];

    const { rows } = await pool.query(query, values);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Error adding items:", error);
    return NextResponse.json({ error: "Error adding items" }, { status: 500 });
  }
}
