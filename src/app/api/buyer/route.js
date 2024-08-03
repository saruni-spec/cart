// pages/api/item.js
import pool from "@/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { rows } = await pool.query("SELECT * FROM buyers ");

    if (rows.length === 0) {
      return NextResponse.json(
        null,
        { message: "buyers not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching buyer:", error);
    return NextResponse.json(
      { error: "Error fetching buyer" },
      { status: 500 }
    );
  }
}

export async function POST(req, res) {
  try {
    const body = await req.json();
    const { firstname, lastname, email, phone, password, location, address } =
      body;

    const query = `
      INSERT INTO buyer ( 
     firstname,lastname,email,phone,password,location,address 
) 
      VALUES ($1, $2, $3,$4,$5,$6,$7) 
      RETURNING *
    `;
    const values = [
      firstname,
      lastname,
      email,
      phone,
      password,
      location,
      address,
    ];

    const { rows } = await pool.query(query, values);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Error adding buyers:", error);
    return NextResponse.json({ error: "Error adding buyers" }, { status: 500 });
  }
}
