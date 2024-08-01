// pages/api/items.js
import pool from "@/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return getInventory(req, res);
    case "POST":
      return addInventory(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getInventory(req, res) {
  const { shop_id } = req.query; // Extract shop_id from query parameters

  if (!shop_id) {
    return res.status(400).json({ error: "shop_id is required" });
  }

  try {
    const { rows } = await pool.query(
      "SELECT * FROM inventory WHERE shop_id = $1",
      [shop_id]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching inventory" });
  }
}

async function addInventory(req, res) {
  const { shopId, quantity, price } = req.body;

  try {
    const query = `
      INSERT INTO inventory (Shop_Id,Quantity,Price) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const values = [shopId, quantity, price];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error adding item to inventory:", error);
    res.status(500).json({ error: "Error adding item to inventory" });
  }
}
