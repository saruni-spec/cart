// pages/api/buyer/login.js
import pool from "@/db";
import argon2 from "argon2";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req, res) {
  try {
    const { email, password } = await req.json();

    // Retrieve the user's hashed password from the database
    const query = "SELECT buyer_id, password FROM buyer WHERE email = $1";
    const { rows } = await pool.query(query, [email]);

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Invalid email or password", DataFetched: null },
        { status: 401 }
      );
    }

    const user = rows[0];

    // Verify the password using Argon2
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password", DataFetched: null },
        { status: 401 }
      );
    }
    const token = jwt.sign(
      { buyer_id: user.buyer_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    // If the password is correct, you can create a session or a JWT token
    // For now, we'll just return a success message
    return NextResponse.json(
      { message: "Login successful", DataFetched: token },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      {
        error: "Error logging in",
        message: "Error Logging in,Please Try Again",
        DataFetched: null,
      },
      { status: 500 }
    );
  }
}
