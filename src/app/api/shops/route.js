// pages/api/items.js
import pool from "@/db";

export default async function handler(req, res) {
  try {
    const { rows } = await pool.query("SELECT * FROM shop");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching shops" });
  }
}
