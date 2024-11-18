import React, { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export const ShowContext = createContext();

const ShowProvider = ({ children }) => {
  const [shows, setShows] = useState([]);
  const [searchShows, setSearchShows] = useState([]);
  const [userList, setUserList] = useState([]);
  const [sortedShows, setSortedShows] = useState([]);
  const [isSorted, setIsSorted] = useState(false);

  const { user } = useContext(UserContext);

  const fetchAllShows = async () => {
    try {
      const response = await fetch("http://localhost:5555/api/show/allShows", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const responseData = await response.json();
      setShows(responseData.shows);
    } catch (error) {
      console.error(error.message);
      console.log("error fetching shows :/");
    }
  };

  const fetchUserList = async (userId) => {
    try {
      if (!userId) {
        return console.log("user id is required to fetch the list.");
      }
      const response = await fetch(
        `http://localhost:5555/api/show/user?id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const responseData = await response.json();
      setUserList(responseData.shows);
    } catch (error) {
      console.error(error.message);
      console.log("error fetching user list :/");
    }
  };

  const addToList = async (showId, status) => {
    try {
      if (!["to-watch", "watched"].includes(status)) {
        console.error("invalid status. must be 'to-watch' or 'watched'.");
        return;
      }
      if (!showId) {
        console.error("show is is required to add to the list.");
        return;
      }
      const response = await fetch("http://localhost:5555/api/show/user/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ showId, status }),
      });
      const responseData = await response.json();
      if (response.ok) {
        setUserList((prevList) => [...prevList, { id: showId, status }]);
        console.log(responseData.message);
      } else {
        console.error(responseData.message || "failed to add show to list.");
      }
    } catch (error) {
      console.error(error.message);
      console.log("error adding show to user list :/");
    }
  };

  const searchQuery = async (query) => {
    try {
      if (!query) {
        console.log("search query is required");
        return;
      }
      const response = await fetch(
        `http://localhost:5555/api/show/search?query=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const responseData = await response.json();
      if (responseData.success) {
        console.log("search results:", responseData.shows);
        setSearchShows(responseData.shows);
      }
    } catch (error) {
      console.error(error.message);
      console.log("cannot search your query for some reason :/");
    }
  };

  const sortAlphabetically = () => {
    const sorted = [...shows].sort((a, b) => a.title.localeCompare(b.title));
    setSortedShows(sorted);
    setIsSorted(true);
  };

  const resetSorting = () => {
    setSortedShows(shows);
    setIsSorted(false);
  };

  useEffect(() => {
    setSortedShows(shows);
  }, [shows]);

  useEffect(() => {
    fetchAllShows();
  }, []);

  useEffect(() => {
    if (user && user._id) {
      fetchUserList(user._id);
    }
  }, [user]);

  return (
    <ShowContext.Provider
      value={{
        shows,
        userList,
        addToList,
        searchShows,
        searchQuery,
        setSearchShows,
        fetchAllShows,
        isSorted,
        sortAlphabetically,
        resetSorting,
        sortedShows,
      }}
    >
      {children}
    </ShowContext.Provider>
  );
};

export default ShowProvider;
