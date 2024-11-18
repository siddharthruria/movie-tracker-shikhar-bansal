import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { ShowContext } from "../context/ShowContext";

const Navbar = () => {
  const { logout, getCookie } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();

  const { setSearchShows, fetchAllShows } = useContext(ShowContext);

  let navigate = useNavigate();

  const handleHomeClick = () => {
    setSearchShows([]);
    fetchAllShows();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <span className="navbar-brand">
            <b>movie-tracker</b>
          </span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  style={{ marginLeft: "1.2vw" }}
                  className="nav-link"
                  aria-current="page"
                  onClick={handleHomeClick}
                  to="/"
                >
                  home
                </Link>
              </li>
            </ul>
            {!getCookie("token") ? (
              <form className="d-flex">
                <Link
                  to="/login"
                  style={{ marginRight: "0.7vw", textDecoration: "none" }}
                  type="button"
                  className="buttons btn btn-primary"
                >
                  login
                </Link>
                <Link
                  to="/signup"
                  style={{ textDecoration: "none" }}
                  type="button"
                  className="buttons btn btn-primary"
                >
                  signup
                </Link>
              </form>
            ) : (
              <div>
                <i
                  className="fa-solid fa-user"
                  style={{ marginRight: "15px", cursor: "pointer" }}
                  onClick={() => {
                    window.open("/user", "_blank");
                  }}
                ></i>
                <Link
                  to="/login"
                  style={{ textDecoration: "none" }}
                  type="button"
                  className="buttons btn btn-primary"
                  onClick={() => {
                    logout();
                    enqueueSnackbar("you are logged out", { variant: "info" });
                  }}
                >
                  logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
