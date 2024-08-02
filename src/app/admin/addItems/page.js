import React from "react";
import AddItem from "../../components/AddItem";
import ItemList from "../../components/ItemsList";

const AddItems = () => {
  const [refresh, setRefresh] = React.useState(false);
  return (
    <>
      <AddItem setRefresh={setRefresh} />
      <ItemList refresh={refresh} setRefresh={setRefresh} />
    </>
  );
};

export default AddItems;
