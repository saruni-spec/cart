// pages/api/item.js
import pool from "@/db";
import { NextResponse } from "next/server";
import { authenticateToken } from "@/src/app/myFunctions/funtions";

export async function GET(req) {
  const user = authenticateToken(req);

  if (!user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Please Sign In To Continue",
        DataFetched: null,
      },
      { status: 401 }
    );
  }

  const buyer_id = user.buyer_id;

  if (!buyer_id) {
    return NextResponse.json(
      {
        error: "buyer_id is required",
        message: "Please Sign In To Continue",
        DataFetched: null,
      },
      { status: 400 }
    );
  }
  try {
    // First, get the cart_id for the given buyer_id
    const cartResult = await pool.query(
      `SELECT cart_id FROM cart WHERE buyer_id = $1 AND status = TRUE LIMIT 1`,
      [buyer_id]
    );

    // Now, get all cart items for this cart
    const { rows } = await pool.query(
      `SELECT
            ci.*,
            i.*,
            inv.shop_id,
            inv.quantity AS inventory_quantity,
            inv.price AS inventory_price
        FROM
            cart_item ci
        JOIN
            inventory inv ON ci.item_id_in_inventory = inv.inventory_item_id
        JOIN
            item i ON inv.item_id = i.item_id
        JOIN
            cart c ON ci.cart_id = c.cart_id
        WHERE
            c.buyer_id = $1;
          `,
      [buyer_id]
    );

    return new Response(
      { message: "Cart loaded successfully", DataFetched: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return new Response(
      JSON.stringify({
        error: "Error fetching cart items",
        message: "Cart not Loaded,Please Try Again",
        DataFetched: [],
      }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const user = authenticateToken(req);
  if (!user) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized",
        message: "Please Sign In",
        DataFetched: null,
      }),
      {
        status: 401,
      }
    );
  }
  const buyer_id = user.buyer_id;
  if (!buyer_id) {
    return new Response(
      JSON.stringify({
        error: "buyer_id is required",
        message: "Please Sign In",
        DataFetched: null,
      }),
      {
        status: 400,
      }
    );
  }

  try {
    const body = await req.json();
    const { cartItems, cart_id } = body;
    let current_cart_id = cart_id;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Invalid cart items",
          message: "Error Adding Iems To Cart,Please try again",
          DataFetched: [],
        }),
        {
          status: 400,
        }
      );
    }

    if (!current_cart_id) {
      const getCartQuery = `
     SELECT Cart_ID 
FROM CART
WHERE Buyer_ID = $1 
  AND Status = TRUE;
   
      LIMIT 1
    `;
      let { rows: cartRows } = await pool.query(getCartQuery, [buyer_id]);

      if (cartRows.length === 0) {
        // Create a new cart if one doesn't exist

        const createCartQuery = `
        INSERT INTO CART (Buyer_ID,  Date, Total_price, Status)
        VALUES ($1, CURRENT_DATE, CURRENT_TIME, 0, FALSE)
        RETURNING Cart_ID
      `;
        const { rows: newCartRows } = await pool.query(createCartQuery, [
          buyer_id,
        ]);
        current_cart_id = newCartRows[0].cart_id;
      } else {
        current_cart_id = cartRows[0].cart_id;
      }
      console.log(current_cart_id, "cart id in cart server");
    }

    // Get or create a cart for the buyer

    // Prepare the query for adding items
    const addItemQuery = `
  INSERT INTO CART_ITEM (Cart_ID, Item_Inventory_ID, Quantity_in_Cart,price,DATE,TIME,CONFIRMED)
  VALUES ($1, $2, $3,$4,CURRENT_DATE, CURRENT_TIME,TRUE)
  ON CONFLICT (Cart_ID, Item_Inventory_ID) 
  DO UPDATE SET Quantity = CART_ITEM.Quantity + $3
  RETURNING *
`;

    let totalPriceIncrease = 0;
    const addedItems = [];

    // Add each item to the cart
    // Add each item to the cart
    for (const item of cartItems) {
      const { item_inventory_id, quantity, price } = item;
      const item_price = price * quantity;
      const { rows } = await pool.query(addItemQuery, [
        current_cart_id,
        item_inventory_id,
        quantity,
        item_price,
      ]);
      addedItems.push(rows[0]);
      totalPriceIncrease += item_price;
    }

    // Update the total price in the CART table
    const updateTotalQuery = `
      UPDATE CART 
      SET Total_price = Total_price + $1 
      WHERE Cart_ID = $2
    `;
    await pool.query(updateTotalQuery, [totalPriceIncrease, current_cart_id]);

    return NextResponse.json(
      {
        message: "Items added to cart successfully",
        DataFetched: { cart: addedItems, cart_id: current_cart_id },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding items to cart:", error);
    return NextResponse.json(
      {
        error: "Error adding items to cart",
        message: "Error Adding Iems To Cart,Please try again",
        DataFetched: [],
      },
      { status: 500 }
    );
  }
}
