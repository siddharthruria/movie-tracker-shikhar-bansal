import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShowContext } from "../context/ShowContext";

const Card = ({ show }) => {
  let navigate = useNavigate();

  const { userList, addToList } = useContext(ShowContext);

  const isInList = userList.find((item) => item._id === show._id);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        margin: "10px",
        maxWidth: "300px",
        textAlign: "center",
      }}
    >
      <img
        src={show.image}
        alt={show.title}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />

      <h3>{show.title}</h3>
      <p>
        <strong>type:</strong> {show.type}
      </p>
      <p>
        <strong>genre:</strong> {show.genre}
      </p>
      <p>
        <strong>release date:</strong> {show.releaseDate}
      </p>
      <p>
        <strong>runtime:</strong> {show.runtime} minutes
      </p>
      {/* <p>
        <strong>description:</strong>{" "}
        {show.description.length > 50
          ? `${show.description.substring(0, 50)}...`
          : show.description}
      </p> */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
        }}
      >
        {!isInList ? (
          <div>
            <i
              className="fa-solid fa-plus"
              style={{ cursor: "pointer", color: "green", fontSize: "10px" }}
              title="add to watch list"
              onClick={() => addToList(show._id, "to-watch")}
            >
              add to watch list
              {console.log({ userList })}
            </i>
          </div>
        ) : (
          <i
            className="fa-solid fa-check"
            style={{ cursor: "default", color: "green", fontSize: "10px" }}
            title={
              isInList.status === "watched"
                ? "already watched"
                : "in to-watch list"
            }
          >
            already in your list
          </i>
        )}

        <i
          className="fa-solid fa-eye"
          style={{ cursor: "pointer", color: "orange" }}
          title="view details"
          onClick={() => navigate(`/details/${show._id}`)}
        ></i>
      </div>
    </div>
  );
};

export default Card;
