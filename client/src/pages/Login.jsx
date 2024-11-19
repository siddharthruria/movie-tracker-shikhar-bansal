import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const submitFunc = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://movie-tracker-backend.onrender.com/api/user/authenticate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            credentials: "include",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const responseData = await response.json();
      if (responseData.success) {
        login(responseData.token);
        enqueueSnackbar("login successful", { variant: "success" });
      } else {
        enqueueSnackbar("invalid credentials", { variant: "error" });
      }
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar("some error occured", { variant: "error" });
    }
  };

  return (
    <div className="container position-relative">
      <h2 className="my-4 position-absolute start-50 translate-middle">
        login
      </h2>
      <form className="py-5 my-4" onSubmit={submitFunc}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            email address
          </label>
          <input
            type="text"
            className="form-control"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary my-3">
            submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
