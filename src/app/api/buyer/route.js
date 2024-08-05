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

    return NextResponse.json(
      { message: "data fetched succesfully", DataFetched: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching buyer:", error);
    return NextResponse.json(
      { error: "Error fetching buyer" },
      { status: 500 }
    );
  }
}
