import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { ShowContext } from "../context/ShowContext";
import Card from "../components/Card";

const User = () => {
  const { userList } = useContext(ShowContext);

  return (
    <div>
      <h1>your shows</h1>
      <div className="card-container">
        {userList.length > 0 ? (
          userList.map((show) => (
            <Card
              key={show._id}
              show={show}
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                padding: "20px",
              }}
            />
          ))
        ) : (
          <p>no shows found in your list.</p>
        )}
      </div>
    </div>
  );
};

export default User;
