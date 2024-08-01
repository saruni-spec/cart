// pages/api/items.js
import pool from "@/db";

export default async function handler(req, res) {
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
