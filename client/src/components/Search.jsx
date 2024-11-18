import React, { useState, useContext } from "react";
import { ShowContext } from "../context/ShowContext";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const { searchShows, searchQuery } = useContext(ShowContext); // Access the search function from context

  const handleSearch = () => {
    if (query.trim()) {
      searchQuery(query); // Call the context function with the search query
    } else {
      console.log("Please enter a valid search query.");
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <input
        type="text"
        placeholder="Search for shows..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          padding: "10px 20px",
          marginLeft: "10px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
