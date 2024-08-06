import pool from "@/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM category WHERE parent_category_id IS NOT NULL;"
    );

    if (rows.length === 0) {
      return NextResponse.json(
        null,
        { message: "Please Add Categories", DataFetched: [] },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Categories Loaded succesfully", DataFetched: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        error: "Error fetching categories",
        message: "Error fetching categories,Try Again",
        DataFetched: [],
      },
      { status: 500 }
    );
  }
}
