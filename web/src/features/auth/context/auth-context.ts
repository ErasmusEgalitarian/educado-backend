import { createContext } from "react";

import type { AuthContextType } from "@/auth/types/auth-context";

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);
