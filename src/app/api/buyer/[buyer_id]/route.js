// pages/api/inventory.js
import pool from "@/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const buyer_id = searchParams.get("buyer_id");

  if (!buyer_id) {
    return NextResponse.json(
      { error: "buyer_id is required" },
      { status: 400 }
    );
  }
  try {
    const query = `
      SELECT *
      FROM buyer
      
      WHERE buyer_id = $1
    `;

    const { rows } = await pool.query(query, [buyer_id]);

    if (rows.length === 0) {
      return NextResponse.json(
        null,
        { message: "Empty dataset" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching inventory buyer info:", error);
    return NextResponse.json(
      { error: "Error fetching inventory buyer info" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { item_id, buyer_id, quantity, price } = body;

    const query = `
     UPDATE buyer
      SET $1= $2
      RETURNING *
    `;
    const values = [item_id, buyer_id, quantity, price];

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
