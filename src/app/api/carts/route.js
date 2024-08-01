// pages/api/items.js
import pool from "@/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return getCart(req, res);
    case "POST":
      return addCart(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getCart(req, res) {
  try {
    const { rows } = await pool.query("SELECT * FROM cart");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart" });
  }
}

async function addCart(req, res) {
  const { Buyer_ID, Store_ID, Date, Time, Total_price } = req.body;

  try {
    const query = `
      INSERT INTO cart (Buyer_ID ,
    Store_ID ,
    Date ,
    Time ,
    Total_price ,
    
) 
      VALUES ($1, $2, $3,$4,$5) 
      RETURNING *
    `;
    const values = [Buyer_ID, Store_ID, Date, Time, Total_price];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error adding cart:", error);
    res.status(500).json({ error: "Error adding cart" });
  }
}
