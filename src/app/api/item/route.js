// pages/api/item.js
import pool from "@/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { rows } = await pool.query("SELECT * FROM item ");

    if (rows.length === 0) {
      return NextResponse.json(
        null,
        {
          message: "Items not found",
          message: "Item List is empty,add new Items",
          DataFetched: [],
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Items data fetched succesfully", DataFetched: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      {
        error: "Error fetching item",
        message: "Error fetching Items,Try again",
        DataFetched: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(req, res) {
  try {
    const body = await req.json();
    const { category_id, name, brand, type, size, measurement, description } =
      body;

    console.log(category_id, name, brand, type, size, measurement, description);

    const query = `
      INSERT INTO item ( 
      category_id,
    name,
    brand,
    type,
    size,measurement,
    description
   
) 
      VALUES ($1, $2, $3,$4,$5,$6,$7) 
      RETURNING *
    `;
    const values = [
      category_id,
      name,

      brand,
      type,
      size,
      measurement,

      description,
    ];

    const { rows } = await pool.query(query, values);
    return NextResponse.json(
      { message: "Item Added", DataFetched: rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding items:", error);
    return NextResponse.json(
      {
        error: "Error adding items",
        message: "Error fetching items,Try again",
        DataFetched: [],
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { field, value, id } = body;

    // Use a switch statement to handle different fields
    let query;
    switch (field) {
      case "name":
        query = "UPDATE item SET name = $1 WHERE item_id = $2 RETURNING *";
        break;
      case "brand":
        query = "UPDATE item SET brand = $1 WHERE item_id = $2 RETURNING *";
        break;
      case "type":
        query = "UPDATE item SET type = $1 WHERE item_id = $2 RETURNING *";
        break;
      case "image_url":
        query = "UPDATE item SET image_url = $1 WHERE item_id = $2 RETURNING *";
        break;
      // Add cases for all other fields that can be updated
      default:
        throw new Error(`Unsupported field: ${field}`);
    }

    const values = [value, id];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Item not found", DataFetched: null },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Item updated successfully", DataFetched: rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      {
        error: "Error updating item",
        message:
          error.message ||
          "An error occurred while updating the item. Please try again.",
        DataFetched: null,
      },
      { status: 500 }
    );
  }
}
