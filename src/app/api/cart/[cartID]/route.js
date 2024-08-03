// pages/api/item.js
import pool from "@/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { buyer_id } = req.query; // Extract buyer_id from query parameters

  if (!buyer_id) {
    return new Response(JSON.stringify({ error: "buyer_id is required" }), {
      status: 400,
    });
  }

  try {
    const { rows } = await pool.query(
      `
      SELECT ci.cart_id, ci.item_id, ci.quantity, ci.price
      FROM cart c
      JOIN cart_item ci ON c.cart_id = ci.cart_id
      WHERE c.buyer_id = $1
      `,
      [buyer_id]
    );
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching cart items" }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { cart_id, item_id, quantity, price } = body;
    const query = `
      INSERT INTO cart_items (cart_id,item_id ,
    quantity ,
    price ,

    
) 
      VALUES ($1, $2, $3,$4) 
      RETURNING *
    `;
    const values = [cart_id, item_id, quantity, price];

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
