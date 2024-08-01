// pages/api/items.js
import pool from "@/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return getOrder(req, res);
    case "POST":
      return addOrders(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getOrdersByShop(req, res) {
  const { shop_id } = req.query; // Extract shop_id from query parameters

  if (!shop_id) {
    return res.status(400).json({ error: "shop_id is required" });
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
      return res.status(404).json({ message: "No orders found for this shop" });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
}

async function addOrders(req, res) {
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
  } = req.body;

  try {
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
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error adding orsder:", error);
    res.status(500).json({ error: "Error adding order" });
  }
}
