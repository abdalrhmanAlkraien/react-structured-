import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../theme/components/ProtectedRoute";
import { Dashboard } from "../modules/dashboard/Page/DashboardPage";
import { LoginPage } from "../modules/Auth/Page/LoginPage";

export function AppRoutes() {

    return(

        <Routes>
            <Route path="/login" element={<LoginPage/>}/>


            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard/>
                    </ProtectedRoute>
                }
                />
        </Routes>
    );
}