import { createContext, useEffect, useState, type ReactNode } from "react";
import type { LoginPayload, LoginStatus } from "./types";
import { useNavigate } from "react-router-dom";

interface AuthContextType extends LoginStatus {
  login: (payload: LoginPayload) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {}
});


export function AuthProvider({ children }: { children: ReactNode }) {

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

    // Load token from localStorage on page refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

    const login = (payload: LoginPayload) => {
    localStorage.setItem("accessToken", payload.token);
    if (payload.user) {
      localStorage.setItem("user", JSON.stringify(payload.user));
      setUser(payload.user);
    }
    setToken(payload.token);

  navigate("/dashboard", { replace: true });
  };

    const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    window.location.href = "/login";
  };

    return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

}