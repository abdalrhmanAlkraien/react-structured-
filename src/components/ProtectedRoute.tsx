import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { AppLayout } from "./AppLayout";

interface Props {
  children: JSX.Element;
}

export function ProtectedRoute({ children }: Props) {


    const token = localStorage.getItem("accessToken");

    if(!token) {
        return <Navigate to="/login" replace />;
    }

    return <AppLayout>{children}</AppLayout>

}