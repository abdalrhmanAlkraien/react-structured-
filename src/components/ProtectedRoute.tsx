import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { useAuth } from "../context/auth/useAuth";

interface Props {
  children: JSX.Element;
}

export function ProtectedRoute({ children }: Props) {


      const { token } = useAuth();

      console.log("token "+token);
      
    // const token = localStorage.getItem("accessToken");

    if(!token) {
        return <Navigate to="/login" replace />;
    }

    return <AppLayout>{children}</AppLayout>
}