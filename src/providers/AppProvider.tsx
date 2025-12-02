import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/auth/AuthContext";

interface Props {
  children: ReactNode;
}

export function AppProvider({children}: Props) {
    return(        
        <BrowserRouter>
            <AuthProvider>
                {children}
            </AuthProvider>
        </BrowserRouter>
    );
    
}