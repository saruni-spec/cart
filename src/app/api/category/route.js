import pool from "@/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { rows } = await pool.query("SELECT * FROM category ");

    if (rows.length === 0) {
      return NextResponse.json(
        null,
        { message: "categories not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "data fetched succesfully", DataFetched: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}
