import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const USER_CACHE_KEY = "ddd_user"; // non-sensitive profile cache only (no token)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session purely from the httpOnly cookie via /auth/me.
  const fetchMe = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      // 401 simply means no valid session cookie — clear any stale cache.
      if (!error?.response || error.response.status !== 401) {
        console.error("Auth session check failed:", error);
      }
      localStorage.removeItem(USER_CACHE_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Optimistically show cached profile for snappy UX, then validate via cookie.
    const cached = localStorage.getItem(USER_CACHE_KEY);
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch (error) {
        console.warn("Failed to parse cached user profile:", error);
        localStorage.removeItem(USER_CACHE_KEY);
      }
    }
    fetchMe();
  }, [fetchMe]);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data.user);
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(data.user));
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    setUser(data.user);
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(data.user));
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem(USER_CACHE_KEY);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
