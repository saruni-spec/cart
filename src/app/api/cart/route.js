// pages/api/item.js
import pool from "@/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { rows } = await pool.query("SELECT * FROM cart");

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Empty dataset", cart: rows },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "data fetched succesfully", DataFetched: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Error fetching cart" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { Buyer_ID, Store_ID, Date, Time, Total_price } = body;

    const query = `
      INSERT INTO cart (Buyer_ID ,
    Store_ID ,
    Date ,
    Time ,
    Total_price ,
    
) 
      VALUES ($1, $2, $3,$4,$5) 
      RETURNING *
    `;
    const values = [Buyer_ID, Store_ID, Date, Time, Total_price];

    const { rows } = await pool.query(query, values);
    return NextResponse.json(
      { message: "data fetched succesfully", DataFetched: rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding cart:", error);
    return NextResponse.json({ error: "Error adding cart" }, { status: 500 });
  }
}
