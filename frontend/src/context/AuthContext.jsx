import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Decode a JWT's payload WITHOUT verifying it — fine for reading our own
// user id/email to display in the UI, since the real verification always
// happens server-side (at the Gateway) on every actual request.
function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("token");
    return saved ? decodeToken(saved) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setUser(decodeToken(token));
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  const login = (newToken) => setToken(newToken);
  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
