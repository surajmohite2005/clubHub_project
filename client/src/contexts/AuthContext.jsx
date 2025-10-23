import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user info
  const fetchMe = async () => {
    try {
      const { data } = await api.get("/api/auth/isAuthenticate");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  // Auth actions
  const login = async (email, password) => {
    await api.post("/api/auth/login", { email, password });
    await fetchMe();
  };

  const register = async ({ name, email, password, role }) => {
    await api.post("/api/auth/register", { name, email, password, role });
    await fetchMe();
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
