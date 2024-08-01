// pages/api/shops/route.js
import pool from "@/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return getShops(req, res);
    case "POST":
      return addShop(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getShops(req, res) {
  try {
    const { rows } = await pool.query("SELECT * FROM shop");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching shops:", error);
    res.status(500).json({ error: "Error fetching shops" });
  }
}

async function addShop(req, res) {
  const { name, location, email, phone, opening_hours, closing_hours } =
    req.body;

  try {
    const query = `
      INSERT INTO shop (name, location, email, phone, opening_hours, closing_hours) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    const values = [name, location, email, phone, opening_hours, closing_hours];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error adding shop:", error);
    res.status(500).json({ error: "Error adding shop" });
  }
}
