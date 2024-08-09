import jwt from "jsonwebtoken";

export const authenticateToken = (req) => {
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

export const addFormToDatabase = async (Data, route, token) => {
  const response = await fetch(`/api/${route}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(Data),
  });

  const result = await response.json();
  return result;
};

export const fetchItemsFromDatabase = async (route, token) => {
  const response = await fetch(`/api/${route}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const itemsData = await response.json();
  console.log(itemsData, "fetchItemsFromDatabae");
  return itemsData;
};

export async function updateItemInDatabase(updateData, route) {
  const response = await fetch(`/api/${route}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  return await response.json();
}

export async function deleteItemFromDatabase(data, route, token) {
  const reponse = await fetch(`/api/${route}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await reponse.json();
}

export function debounce(func, timeout) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
export async function alterTables(query) {
  const client = await pool.connect();
  try {
    await client.query(query);
    console.log("Tables altered successfully");
  } catch (err) {
    console.error("Error altering tables:", err);
  } finally {
    client.release();
  }
}
