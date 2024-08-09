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
            inv.inventory_quantity AS inventory_quantity,
            inv.price AS inventory_price
        FROM
            cart_item ci
        JOIN
            inventory inv ON ci.inventory_item_id = inv.inventory_item_id
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
    console.log(cartItems, "cartItems", cart_id, "cart id o add");

    if (!current_cart_id) {
      const getCartQuery = `
     SELECT Cart_ID 
FROM CART
WHERE Buyer_ID = $1 
  AND Status = TRUE
   
      LIMIT 1;
    `;
      let { rows: cartRows } = await pool.query(getCartQuery, [buyer_id]);

      if (cartRows.length === 0) {
        // Create a new cart if one doesn't exist
        console.log("Creating new cart");

        const createCartQuery = `
        INSERT INTO CART (Buyer_ID,  Date_created, Total_cart_price, Status)
        VALUES ($1, CURRENT_DATE, 0, TRUE)
        RETURNING Cart_ID
      `;
        const { rows: newCartRows } = await pool.query(createCartQuery, [
          buyer_id,
        ]);
        current_cart_id = newCartRows[0].cart_id;
      } else {
        console.log("Using existing cart");
        current_cart_id = cartRows[0].cart_id;
      }
      console.log(current_cart_id, "cart id in cart server");
    }

    // Get or create a cart for the buyer

    // Prepare the query for adding items
    const checkItemQuery = `
    SELECT
            ci.*,
            i.*,
            inv.shop_id,
            inv.inventory_quantity AS inventory_quantity,
            inv.price AS inventory_price
        FROM
            cart_item ci
        JOIN
            inventory inv ON ci.inventory_item_id = inv.inventory_item_id
        JOIN
            item i ON inv.item_id = i.item_id
        JOIN
            cart c ON ci.cart_id = c.cart_id
        
  WHERE c.Cart_ID = $1;
  `;

    const addItemQuery = `
    INSERT INTO CART_ITEM (Cart_ID, inventory_item_id, Quantity_in_Cart, cart_item_price, date_added, time_added, isconfirmed)
    VALUES ($1, $2, $3, $4, CURRENT_DATE, CURRENT_TIME, TRUE)
    RETURNING *
  `;

    let totalPriceIncrease = 0;

    let { rows } = await pool.query(checkItemQuery, [current_cart_id]);
    const cartCurrentItems = rows;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return new Response(
        JSON.stringify({
          message: "Cart synced from previous session",
          DataFetched: cartCurrentItems,
        }),
        {
          status: 200,
        }
      );
    }

    console.log("cartCurrentItems in server", cartCurrentItems);

    for (const item of cartItems) {
      const { inventory_item_id, quantity_in_cart, price } = item;
      const item_price = price * quantity_in_cart;
      const existingItem = cartCurrentItems.find(
        (cartItem) => cartItem.inventory_item_id === inventory_item_id
      );

      if (existingItem) {
        console.log("Item already exists in cart, updating quantity");
        const updateQuery = `
                UPDATE CART_ITEM
                SET quantity_in_cart = $1
                WHERE Cart_ID = $2 AND inventory_item_id = $3;`;
        const updateQuery2 = `
                UPDATE CART_ITEM
                SET cart_item_price = $1
                WHERE Cart_ID = $2 AND inventory_item_id = $3;`;
        await pool.query(updateQuery, [
          quantity_in_cart,
          current_cart_id,
          inventory_item_id,
        ]);
        await pool.query(updateQuery2, [
          item_price,
          current_cart_id,
          inventory_item_id,
        ]);

        // Calculate the price difference
      } else {
        console.log("Item does not exist in cart, adding item");
        await pool.query(addItemQuery, [
          current_cart_id,
          inventory_item_id,
          quantity_in_cart,
          item_price,
        ]);
      }
      totalPriceIncrease += item_price;
    }

    const addedItems = await pool.query(checkItemQuery, [current_cart_id]);

    console.log(addedItems.rows, "addedItems we have the new cart in server");
    // Update the total price in the CART table
    const updateTotalQuery = `
      UPDATE CART 
      SET Total_cart_price =  $1 
      WHERE Cart_ID = $2
    `;
    await pool.query(updateTotalQuery, [totalPriceIncrease, current_cart_id]);

    console.log("Items added to cart successfully");

    return NextResponse.json(
      {
        message: "Items added to cart successfully",
        DataFetched: { cart: addedItems.rows, cart_id: current_cart_id },
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
export async function DELETE(req) {
  const user = authenticateToken(req);
  if (!user) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized",
        message: "Please Sign In",
        DataFetched: null,
      }),
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const { cartitem_id, cart_id } = body;

    if (!cartitem_id || !cart_id) {
      return new Response(
        JSON.stringify({
          error: "Missing parameters",
          message: "Cart item ID and Cart ID are required",
          DataFetched: null,
        }),
        { status: 400 }
      );
    }

    // First, get the price of the item to be deleted
    const getItemPriceQuery = `
      SELECT cart_item_price
      FROM CART_ITEM
      WHERE cartitem_id = $1 AND cart_id = $2
    `;
    const { rows: priceRows } = await pool.query(getItemPriceQuery, [
      cartitem_id,
      cart_id,
    ]);

    if (priceRows.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Item not found",
          message: "The specified cart item does not exist",
          DataFetched: null,
        }),
        { status: 404 }
      );
    }

    const itemPrice = priceRows[0].cart_item_price;

    // Delete the cart item
    const deleteItemQuery = `
     UPDATE cart_item SET isconfirmed=FALSE
      WHERE cartitem_id = $1 
    `;
    await pool.query(deleteItemQuery, [cartitem_id]);

    // Update the total price in the CART table
    const updateCartPriceQuery = `
      UPDATE CART
      SET Total_cart_price = Total_cart_price - $1
      WHERE Cart_ID = $2
    `;
    await pool.query(updateCartPriceQuery, [itemPrice, cart_id]);

    // Fetch the updated cart items
    const getUpdatedCartQuery = `
      SELECT ci.*, i.*, inv.shop_id, inv.inventory_quantity, inv.price AS inventory_price
      FROM CART_ITEM ci
      JOIN INVENTORY inv ON ci.inventory_item_id = inv.inventory_item_id
      JOIN ITEM i ON inv.item_id = i.item_id
      WHERE ci.cart_id = $1
    `;
    const { rows: updatedCart } = await pool.query(getUpdatedCartQuery, [
      cart_id,
    ]);

    return new Response(
      JSON.stringify({
        message: "Cart item deleted successfully",
        DataFetched: { cart: updatedCart, cart_id: cart_id },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return new Response(
      JSON.stringify({
        error: "Error deleting cart item",
        message: "An unexpected error occurred",
        DataFetched: null,
      }),
      { status: 500 }
    );
  }
}
