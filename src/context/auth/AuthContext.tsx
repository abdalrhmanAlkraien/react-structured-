import {createContext, type ReactNode, useEffect, useState} from "react";
import type {LoginPayload, LoginStatus} from "./types";
import {useNavigate} from "react-router-dom";
import {getHomeRedirect} from "../../common/lib/RouteHelper.ts";

interface AuthContextType extends LoginStatus {
  login: (payload: LoginPayload) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {
  },
  logout: () => {
  },
  loading: true
});

export function AuthProvider({children}: { children: ReactNode }) {

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Load token from localStorage on page refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = (payload: LoginPayload) => {
    localStorage.setItem("accessToken", payload.token);
    if (payload.user) {
      localStorage.setItem("user", JSON.stringify(payload.user));
      setUser(payload.user);
    }
    setToken(payload.token);

    navigate(getHomeRedirect(payload.user.roles), {replace: true});
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setLoading(true);

    window.location.href = "/login";
  };

  return (
      <AuthContext.Provider value={{token, user, login, logout, loading}}>
        {children}
      </AuthContext.Provider>
  );

}