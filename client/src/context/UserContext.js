import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getCookie("token") || null);

  let navigate = useNavigate();

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://localhost:5555/api/user/getUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.error("token invalid or server restarted");
      }

      const userData = await response.json();
      setUser(userData.user);
    } catch (error) {
      setToken(null);
      setUser(null);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUserData(token);
  }, [token]);

  const login = (token) => {
    const expirationDays = 4;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);
    document.cookie = `token=${token}; path=/; expires=${expirationDate.toUTCString()}; SameSite=Strict`; // store token in cookies with expiration

    setToken(token);
    fetchUserData(token);
    navigate("/");
  };

  const logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // clear token from cookies
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; ++i) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  }

  return (
    <UserContext.Provider value={{ user, token, login, logout, getCookie }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
