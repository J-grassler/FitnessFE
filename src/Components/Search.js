import React from "react";

const Search = (props) => {
  const { filterTerm, setFilterTerm } = props;

  return (
    <form
      id="search"
      className="search"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <input
        id="keywords"
        type="text"
        placeholder="Search"
        className="search"
        value={filterTerm}
        onChange={(event) => {
          setFilterTerm(event.target.value);
        }}
      />
      <button onClick={() => setFilterTerm("")}>RESET FILTER</button>
    </form>
  );
};

export default Search;