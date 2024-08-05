// pages/api/item.js
import pool from "@/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const authenticateToken = (req) => {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
};

export async function GET(req) {
  const user = authenticateToken(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const buyer_id = user.buyer_id;

  if (!buyer_id) {
    return NextResponse.json(
      { error: "buyer_id is required" },
      { status: 400 }
    );
  }
  try {
    // First, get the cart_id for the given buyer_id
    const cartResult = await pool.query(
      `SELECT cart_id FROM cart WHERE buyer_id = $1 LIMIT 1`,
      [buyer_id]
    );

    if (cartResult.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "No cart found for this buyer" }),
        {
          status: 404,
        }
      );
    }

    const cart_id = cartResult.rows[0].cart_id;

    // Now, get all cart items for this cart
    const { rows } = await pool.query(
      `
          SELECT ci.cart_id, ci.item_id, ci.size,ci.measurement, ci.price, i.name, i.brand, i.image_url
          FROM cart_item ci
          JOIN item i ON ci.item_id = i.item_id
          WHERE ci.cart_id = $1
          `,
      [cart_id]
    );

    return new Response(
      { message: "data fetched succesfully", DataFetched: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching cart items" }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const user = authenticateToken(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  const buyer_id = user.buyer_id;
  if (!buyer_id) {
    return new Response(JSON.stringify({ error: "buyer_id is required" }), {
      status: 400,
    });
  }

  try {
    const body = await req.json();
    const { cartItems, store_id } = body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid cart items" }), {
        status: 400,
      });
    }

    // Get or create a cart for the buyer
    const getCartQuery = `
      SELECT Cart_ID FROM CART 
      WHERE Buyer_ID = $1 
   
      LIMIT 1
    `;
    let { rows: cartRows } = await pool.query(getCartQuery, [buyer_id]);

    let cart_id;
    if (cartRows.length === 0) {
      // Create a new cart if one doesn't exist

      const createCartQuery = `
        INSERT INTO CART (Buyer_ID, Store_ID, Date, Time, Total_price, Status)
        VALUES ($1, $2, CURRENT_DATE, CURRENT_TIME, 0, 'active')
        RETURNING Cart_ID
      `;
      const { rows: newCartRows } = await pool.query(createCartQuery, [
        buyer_id,
        store_id,
      ]);
      cart_id = newCartRows[0].cart_id;
    } else {
      cart_id = cartRows[0].cart_id;
    }
    console.log(cart_id, "cart id in cart server");
    // Prepare the query for adding items
    const addItemQuery = `
  INSERT INTO CART_ITEM (Cart_ID, Item_ID, Quantity)
  VALUES ($1, $2, $3)
  ON CONFLICT (Cart_ID, Item_ID) 
  DO UPDATE SET Quantity = CART_ITEM.Quantity + $3
  RETURNING *
`;

    let totalPriceIncrease = 0;
    const addedItems = [];

    // Add each item to the cart
    // Add each item to the cart
    for (const item of cartItems) {
      const { item_id, quantity, price } = item;
      const { rows } = await pool.query(addItemQuery, [
        cart_id,
        item_id,
        quantity,
      ]);
      addedItems.push(rows[0]);
      totalPriceIncrease += price * quantity;
    }

    // Update the total price in the CART table
    const updateTotalQuery = `
      UPDATE CART 
      SET Total_price = Total_price + $1 
      WHERE Cart_ID = $2
    `;
    await pool.query(updateTotalQuery, [totalPriceIncrease, cart_id]);

    return NextResponse.json(
      { message: "Items added to cart successfully", DataFetched: addedItems },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding items to cart:", error);
    return NextResponse.json(
      { error: "Error adding items to cart" },
      { status: 500 }
    );
  }
}
