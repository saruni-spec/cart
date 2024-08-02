// pages/api/item.js
import pool from "@/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return getInventoryItems(req, res);
    case "POST":
      return addInventory(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
async function getItem(req, res) {
  const { item__id } = req.query; // Extract item_id from query parameters

  if (!item__id) {
    return res.status(400).json({ error: "item_id is required" });
  }

  try {
    const { rows } = await pool.query("SELECT * FROM item where item_id=$1", [
      item__id,
    ]);
    res.status(200).json(rows);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ error: "Error fetching item" });
  }
}

async function addInventory(req, res) {
  const {
    Category_ID,
    Name,
    Quality,
    Brand,
    Type,
    Quantity,
    Price,
    Description,
    Image_URL,
  } = req.body;

  try {
    const query = `
      INSERT INTO item (Category_ID ,
    Name ,
    Quality ,
    Brand ,
    Type ,
    Quantity ,
    Price ,
    Description ,
    Image_URL 
) 
      VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9) 
      RETURNING *
    `;
    const values = [
      Category_ID,
      Name,
      Quality,
      Brand,
      Type,
      Quantity,
      Price,
      Description,
      Image_URL,
    ];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error adding item to inventory:", error);
    res.status(500).json({ error: "Error adding item to inventory" });
  }
}
