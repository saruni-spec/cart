export const addFormToDatabase = async (Data, route, setMessage) => {
  try {
    const response = await fetch(`/api/${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    setMessage(`${route} added successfully!`);
  } catch (error) {
    console.error(`Error adding ${route}`, error.message);
    setMessage(
      `Failed to add ${route}. Please try again. Error: ${error.message}`
    );
  }
};

export const fetchItemsFromDatabase = async (route) => {
  try {
    const response = await fetch(`/api/${route}`);
    if (!response.ok) {
      throw new Error("Failed to fetch items");
    }
    const itemsData = await response.json();
    return itemsData;
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
