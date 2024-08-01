// pages/api/items.js
import pool from "@/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { shop_id } = req.query; // Extract shop_id from query parameters

  if (!shop_id) {
    return NextResponse.json({ error: "shop_id is required" }, { status: 400 });
  }

  try {
    // Join the ORDER table with the CART table to get the shop_id
    const query = `
      SELECT o.* 
      FROM "ORDER" o
      JOIN CART c ON o.cart_id = c.cart_id
      WHERE c.store_id = $1
    `;

    const { rows } = await pool.query(query, [shop_id]);

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "No orders found for this shop" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Error fetching orders" },
      { status: 500 }
    );
  }
}

export async function POST(req, res) {
  try {
    const body = await req.json();
    const {
      Buyer_ID,
      Cart_ID,
      Total_Price,
      Status,
      Payment_Method,
      Delivery_Method,
      Delivery_Address,
      Order_Date,
      Pickup_Time,
    } = body;

    const query = `
      INSERT INTO inventory (Buyer_ID ,
    Cart_ID ,
    Total_Price ,
    Status ,
    Payment_Method ,
    Delivery_Method ,
    Delivery_Address ,
    Order_Date ,
    Pickup_Time ,
   
) 
      VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9) 
      RETURNING *
    `;
    const values = [
      Buyer_ID,
      Cart_ID,
      Total_Price,
      Status,
      Payment_Method,
      Delivery_Method,
      Delivery_Address,
      Order_Date,
      Pickup_Time,
    ];

    const { rows } = await pool.query(query, values);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Error adding orsder:", error);
    return NextResponse.json({ error: "Error adding order" }, { status: 500 });
  }
}
