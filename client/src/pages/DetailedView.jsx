import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DetailedView = () => {
  const { id } = useParams();
  const [showDetails, setShowDetails] = useState(null);
  const [error, setError] = useState(null);

  const fetchShowDetails = async () => {
    try {
      const response = await fetch(`https://movie-tracker-backend.onrender.com/api/show?id=${id}`);
      if (!response.ok) {
        return console.error("failed to fetch details of show :/");
      }
      const data = await response.json();
      setShowDetails(data.show);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    fetchShowDetails();
  }, [id]);

  //   useEffect(() => {
  //     const fetchShowDetails = async () => {
  //       try {
  //         const response = await fetch(`/api/show?id=${id}`);
  //         if (!response.ok) {
  //           throw new Error("Failed to fetch show details");
  //         }
  //         const data = await response.json();
  //         setShowDetails(data.show); // Assuming your backend response contains `show`
  //       } catch (err) {
  //         setError(err.message);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchShowDetails();
  //   }, [id]);

  if (!showDetails) {
    return <p>no details available for this show.</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <img
        src={showDetails.image}
        alt={showDetails.title}
        style={{ width: "100%", borderRadius: "8px", marginBottom: "20px" }}
      />
      <h1>{showDetails.title}</h1>
      <p>
        <strong>Type:</strong> {showDetails.type}
      </p>
      <p>
        <strong>Genre:</strong> {showDetails.genre}
      </p>
      <p>
        <strong>Release Date:</strong> {showDetails.releaseDate}
      </p>
      <p>
        <strong>Runtime:</strong> {showDetails.runtime} minutes
      </p>
      <p>
        <strong>Description:</strong>
      </p>
      <p>{showDetails.description}</p>
    </div>
  );
};

export default DetailedView;
