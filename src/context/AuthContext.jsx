import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("sms_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("sms_token") || "");

  useEffect(() => {
    if (user && token) {
      localStorage.setItem("sms_user", JSON.stringify(user));
      localStorage.setItem("sms_token", token);
    } else {
      localStorage.removeItem("sms_user");
      localStorage.removeItem("sms_token");
    }
  }, [user, token]);

  const login = async (email, password) => {
    try {
      const res = await fetch("/api/sms/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setUser(data.user);
        setToken(data.token);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: "Network error" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
