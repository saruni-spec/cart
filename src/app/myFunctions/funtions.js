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
