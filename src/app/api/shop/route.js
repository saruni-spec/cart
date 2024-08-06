import pool from "@/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { rows } = await pool.query("SELECT * FROM shop");

    if (rows.length === 0) {
      return NextResponse.json(
        null,
        { message: "Empty dataset" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Shops fetched successfully", DataFetched: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json(
      {
        error: "Error fetching shops",
        message: "Error fetching Shops,Please Try Again",
        DataFetched: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, location, email, phone, opening_hours, closing_hours } = body;

    const query = `
      INSERT INTO shop (name, location, email, phone, opening_hours, closing_hours) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    const values = [name, location, email, phone, opening_hours, closing_hours];

    const { rows } = await pool.query(query, values);
    return NextResponse.json(
      { message: "Shop added ", DataFetched: rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding shop:", error);
    return NextResponse.json(
      {
        error: "Error adding shop",
        message: "Error adding shop,Please Try Again",
        DataFetched: null,
      },
      { status: 500 }
    );
  }
}
