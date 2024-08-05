export const addFormToDatabase = async (Data, route, setMessage, token) => {
  try {
    const response = await fetch(`/api/${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(Data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to add ${route}: ${response.status} ${
          response.statusText
        }. ${JSON.stringify(errorData)}`
      );
    }

    const result = await response.json();
    setMessage(result.message);
    return result.DataFetched;
  } catch (error) {
    console.error(`Error adding ${route}`, error.message);
    setMessage(`Failed  ${route}. Please try again. Error: ${error.message}`);
    return [];
  }
};

export const fetchItemsFromDatabase = async (route, token) => {
  try {
    const response = await fetch(`/api/${route}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch items");
    }
    const itemsData = await response.json();
    return itemsData.DataFetched;
  } catch (error) {
    console.error("Error fetching items", error.message);
    return [];
  }
};

export function debounce(func, timeout) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
