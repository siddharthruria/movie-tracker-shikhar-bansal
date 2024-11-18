import React, { useContext } from "react";
import Card from "../components/Card";
import { ShowContext } from "../context/ShowContext";
import SearchBar from "../components/Search";

const Home = () => {
  const {
    shows,
    userList,
    addToList,
    searchShows,
    isSorted,
    sortAlphabetically,
    resetSorting,
    sortedShows,
  } = useContext(ShowContext);

  return (
    <>
      <h1>all movies and shows</h1>
      <SearchBar />
      <div
        className="container d-flex"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <button onClick={sortAlphabetically} disabled={isSorted}>
          sort alphabetically
        </button>
        <button onClick={resetSorting} disabled={!isSorted}>
          reset
        </button>
      </div>
      <div className="card-container">
        {searchShows.length > 0 ? (
          searchShows.map((show) => <Card key={show._id} show={show} />)
        ) : (
          <>
            <p>no shows found. try searching for something else!</p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              {sortedShows.map((show) => (
                <Card
                  key={show._id}
                  show={show}
                  userList={userList}
                  onAddToList={addToList}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
