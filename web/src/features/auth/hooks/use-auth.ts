import { useContext } from "react";

import { AuthContext } from "@/auth/context/auth-context";
import type { AuthContextType } from "@/auth/types/auth-context";

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
};
