// pages/api/items.js
import pool from "@/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return getCartItems(req, res);
    case "POST":
      return addCartItems(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getCartItems(req, res) {
  const { cart_id } = req.query; // Extract shop_id from query parameters

  if (!cart_id) {
    return res.status(400).json({ error: "cart_id is required" });
  }

  try {
    const { rows } = await pool.query(
      "SELECT * FROM cart_item WHERE cart_id = $1",
      [cart_id]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart items" });
  }
}

async function addCartItems(req, res) {
  const { Item_ID, Quantity, Price } = req.body;

  try {
    const query = `
      INSERT INTO cart_items (Item_ID ,
    Quantity ,
    Price ,

    
) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const values = [Item_ID, Quantity, Price];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error adding cart_items:", error);
    res.status(500).json({ error: "Error adding cart_items" });
  }
}
