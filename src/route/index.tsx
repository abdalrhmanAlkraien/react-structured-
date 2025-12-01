import { Route, Routes } from "react-router-dom";
import { Login } from "../modules/Auth/Component/Login";
import { ProtectedRoute } from "../components/ProtectedRoute";

export function AppRoutes() {

    return(

        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Login/>
                    </ProtectedRoute>
                }
                />
        </Routes>
    );
}