import {Navigate, Outlet, Route, Routes} from "react-router-dom";
import { ProtectedRoute } from "../theme/components/ProtectedRoute";
import { CompanyDashboard } from "../modules/company/dashboard/Page/DashboardPage";
import { LoginPage } from "../modules/auth/page/LoginPage";
import {useAuth} from "../context/auth/useAuth.ts";
import {PlatformDashboardPage} from "../modules/platform/dashboard/page/DashboardPage.tsx";
import {ForbiddenPage} from "../modules/forbidden/page/ForbideenPage.tsx";
import {CompanyPageList} from "../modules/platform/company/page/CompanyPageList.tsx";
import {CreateCompanyPage} from "../modules/platform/company/page/CreateCompanyPage.tsx";
import {CompanyDetailsPage} from "../modules/platform/company/page/CompanyDetailsPage.tsx";
import {UpdateCompanyPage} from "../modules/platform/company/page/UpdateCompanyPage.tsx";
import {getHomeRedirect} from "../lib/RouteHelper.ts";

export function AppRoutes() {

    const { token,user } = useAuth();

    return(
        <>
            <Routes>

                <Route
                    path="/"
                    element={
                        token
                            ? <Navigate to={getHomeRedirect(user?.roles || [])} replace />
                            : <Navigate to="/login" replace />
                    }
                />

                {/* LOGIN */}
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/platform"
                    element={
                        <ProtectedRoute requiredRoles={["PLATFORM_ADMIN"]}>
                            <Outlet />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<PlatformDashboardPage />} />

                    <Route path="company" element={<CompanyPageList />} />
                    <Route path="company/create" element={<CreateCompanyPage />} />
                    <Route path="company/details/:id" element={<CompanyDetailsPage />} />
                    <Route path="company/update/:id" element={<UpdateCompanyPage />} />

                </Route>


                {/* COMPANY ADMIN ROUTES */}
                <Route
                    path="/company"
                    element={
                        <ProtectedRoute requiredRoles={["COMPANY_ADMIN"]}>
                            <Outlet />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<CompanyDashboard />} />
                </Route>


                {/* 403 – Forbidden */}
                <Route path="/403" element={<ForbiddenPage />} />
            </Routes>
        </>

    );
}