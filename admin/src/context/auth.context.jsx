/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const validToken = `Bearer ${token}`;
  let isLoggedIn = !!token;

  const storeToken = (serverToken) => {
    setToken(serverToken);
    return localStorage.setItem("token", serverToken);
  };

  const logOutUser = () => {
    setToken("");
    return localStorage.removeItem("token");
  };

  const loggedInUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/v1/auth/loggedin-user", {
        headers: {
          Authorization: validToken,
        },
      });
      if (response?.data?.success) {
        setUser(response?.data?.data);
      };
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    };
  };

  useEffect(() => {
    loggedInUser();
  }, []);

  return (
    <AuthContext.Provider value={{ storeToken, logOutUser, isLoggedIn, user, isLoading, validToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};