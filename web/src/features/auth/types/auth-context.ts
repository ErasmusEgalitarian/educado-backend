import { RenderMode } from "@/shared/data-display/hooks/used-paginated-data";
import { User } from "@/user/types/user.ts";

// TODO: Replace User with Strapi user
export interface AuthContextType {
    loggedInUser: User | null;
    setLoggedInUser: (user: User | null) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loginSaver: (token: string, user: any) => Promise<void>;
    logout: () => void;
    preferences: UserPreferences;
    setPreferences: (preferences: Partial<UserPreferences>) => void;
}

export interface UserPreferences {
    language: "en" | "pt";
    preferredRenderMode: RenderMode; // e.., "auto" | "client" | "server"
    clientServerThreshold: number; // Entities count threshold to switch between client and server rendering
}

export const defaultUserPreferences: UserPreferences = {
    language: "en",
    preferredRenderMode: "auto",
    clientServerThreshold: 10000,
};

