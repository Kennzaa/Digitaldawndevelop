import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("ddd_token"));
  const [loading, setLoading] = useState(true);

  const persist = useCallback((tkn, usr) => {
    if (tkn) {
      localStorage.setItem("ddd_token", tkn);
      setToken(tkn);
    }
    if (usr) {
      localStorage.setItem("ddd_user", JSON.stringify(usr));
      setUser(usr);
    }
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
      localStorage.setItem("ddd_user", JSON.stringify(data));
    } catch (e) {
      // token invalid
      localStorage.removeItem("ddd_token");
      localStorage.removeItem("ddd_user");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem("ddd_user");
    if (cached) {
      try { setUser(JSON.parse(cached)); } catch (e) { /* ignore */ }
    }
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persist(data.token, data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    persist(data.token, data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("ddd_token");
    localStorage.removeItem("ddd_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};
