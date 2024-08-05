import React from "react";

const Search = () => {
  const [search, setSearch] = useState("");
  const searchItem = (e) => {
    setSearch(e.target.value);
  };
  return (
    <div>
      <label>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={searchItem}
        />
      </label>
    </div>
  );
};

export default Search;
