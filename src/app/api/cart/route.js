// pages/api/item.js
import pool from "@/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { rows } = await pool.query("SELECT * FROM cart");

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "No Data Found", DataFetched: [] },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Cart data fetched succesfully", DataFetched: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      {
        error: "Error fetching carts",
        message: "Error Fetching Carts,Please try again",
        DataFetched: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { Buyer_ID, Total_price } = body;

    const createCartQuery = `
    INSERT INTO CART (Buyer_ID,  Date, Time, Status)
    VALUES ($1,$2, CURRENT_DATE, CURRENT_TIME, 0, 'active')
    RETURNING Cart_ID
  `;
    const values = [Buyer_ID, Total_price];

    const { rows } = await pool.query(createCartQuery, values);
    return NextResponse.json(
      { message: "Cart data fetched succesfully", DataFetched: rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding cart:", error);
    return NextResponse.json(
      {
        error: "Error adding cart",
        message: "Error Adding cart Items,Please try again",
        DataFetched: [],
      },
      { status: 500 }
    );
  }
}
