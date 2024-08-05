// pages/api/inventory.js
import pool from "@/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const shop_id = searchParams.get("shop_id");

  if (!shop_id) {
    return NextResponse.json({ error: "shop_id is required" }, { status: 400 });
  } else {
    console.log(shop_id, "this is the shop id");
    console.log(req.url, "this is the req.url");
  }

  try {
    const query = `
      SELECT i.item_id, i.name, i.brand, i.type,  i.description, i.image_url, inv.quantity,inv.price
      FROM INVENTORY inv
      JOIN ITEM i ON inv.item_id = i.item_id
      WHERE inv.shop_id = $1
    `;

    const { rows } = await pool.query(query, [shop_id]);

    if (rows.length === 0) {
      return NextResponse.json(
        null,
        { message: "Empty dataset" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "data fetched succesfully", DataFetched: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return NextResponse.json(
      { error: "Error fetching inventory items" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { item_id, shop_id, quantity, price } = body;

    const query = `
      INSERT INTO inventory (item_id,shop_Id,quantity,price) 
      VALUES ($1, $2, $3,$4) 
      RETURNING *
    `;
    const values = [item_id, shop_id, quantity, price];

    const { rows } = await pool.query(query, values);
    return NextResponse.json(
      { message: "data fetched succesfully", DataFetched: rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding item to inventory:", error);
    return NextResponse.json(
      { error: "Error adding item to inventory" },
      { status: 500 }
    );
  }
}
