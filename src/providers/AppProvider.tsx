import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/auth/AuthContext";
import {NotificationProvider} from "./NotificationProvider.tsx";
import "../assets/styles/notification.css";


interface Props {
  children: ReactNode;
}

export function AppProvider({children}: Props) {
    return(        
        <BrowserRouter>
            <AuthProvider>
                <NotificationProvider>
                    {children}
                </NotificationProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}