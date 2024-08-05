// pages/api/inventory.js
import pool from "@/db";
import argon2 from "argon2";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }
  try {
    const query = `
      SELECT *
      FROM buyer
      
      WHERE email = $1
    `;

    const { rows } = await pool.query(query, [email]);

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

export async function POST(req, res) {
  try {
    const body = await req.json();
    const { firstname, lastname, email, phone, password, location, address } =
      body;

    // Hash the password using Argon2
    const hashedPassword = await argon2.hash(password);

    const query = `
      INSERT INTO buyer (
        firstname, lastname, email, phone, password, location, address
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      firstname,
      lastname,
      email,
      phone,
      hashedPassword,
      location,
      address,
    ];

    const { rows } = await pool.query(query, values);
    const user = rows[0];
    const token = jwt.sign(
      { buyer_id: user.buyer_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    return NextResponse.json(
      { message: "data fetched succesfully", DataFetched: token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding buyers:", error);
    return NextResponse.json({ error: "Error adding buyers" }, { status: 500 });
  }
}
