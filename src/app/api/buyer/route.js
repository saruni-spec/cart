// pages/api/item.js
import pool from "@/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { rows } = await pool.query("SELECT * FROM buyers ");

    if (rows.length === 0) {
      return NextResponse.json(
        { DataFetched: [] },
        { message: "No buyer data found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Buyer Data fetched succesfully", DataFetched: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching buyer:", error);
    return NextResponse.json(
      {
        error: "Error fetching buyer",
        message: "Error fetching buyers,Please Try Again",
        DataFetched: [],
      },
      { status: 500 }
    );
  }
}
