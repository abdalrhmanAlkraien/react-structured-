import {type JSX} from "react";
import {Navigate} from "react-router-dom";
import {AppLayout} from "./AppLayout";
import {useAuth} from "../../context/auth/useAuth";

interface Props {
    children: JSX.Element;
    requiredRoles?: string[];
}

export function ProtectedRoute({children, requiredRoles}: Props) {


    const {token, user, loading} = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!token) {
        return <Navigate to="/login" replace/>;
    }

    if (requiredRoles && user?.roles) {
        const hasRole = user.roles.some((r) => requiredRoles.includes(r));
        if (!hasRole) return <Navigate to="/403" replace/>;
    }

    return <AppLayout>{children}</AppLayout>
}