"use client";

import { useCallback, useEffect, useMemo, type ReactNode } from "react";

import { AuthContext } from "@/auth/context/auth-context";
import { defaultUserPreferences } from "@/auth/types/auth-context";
import type { AuthContextType, UserPreferences } from "@/auth/types/auth-context";
import { useLocalStorage } from "@/shared/hooks/use-local-storage";
import type { User } from "@/user/types/User";

// https://www.shadcn.io/hooks/use-local-storage

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Persist logged in user
  const [loggedInUser, setLoggedInUserLS, removeLoggedInUser] =
    useLocalStorage<User | null>("loggedInUser", null);

  // Persist auth token (mock)
  const [, setAuthToken, removeAuthToken] = useLocalStorage<string | null>(
    "auth:token",
    null,
  );

  // Persist user preferences
  const [preferences, setPreferencesLS] = useLocalStorage<UserPreferences>(
    "userPreferences",
    defaultUserPreferences,
  );

  // Mock login: accepts email/password and returns a fake user
  const login = useCallback(
    (email: string, password: string): Promise<User> => {
      // Create a simple mock user from the email
      const [namePart] = email.split("@");
      const now = new Date().toISOString();

      const mockUser: User = {
        // Using Math.random for a temporary mock ID is acceptable in mock code.
        // eslint-disable-next-line sonarjs/pseudo-random
        _id: Math.random().toString(36).slice(2),
        role: email.includes("admin") ? "admin" : "user",
        firstName:
          namePart.length > 0
            ? namePart.charAt(0).toUpperCase() + namePart.slice(1)
            : "User",
        lastName: "",
        email,
        joinedAt: now,
        dateUpdated: now,
      };

      // Store a mock token
      setAuthToken(btoa(`${email}:${password}`));

      // Set the user in local storage
      setLoggedInUserLS(mockUser);
      return Promise.resolve(mockUser);
    },
    [setLoggedInUserLS, setAuthToken],
  );

  // Mock logout: clears user from storage
  const logout = useCallback(() => {
    removeAuthToken();
    removeLoggedInUser();
  }, [removeAuthToken, removeLoggedInUser]);

  // Merge-only setter for preferences
  // Don't use useCallback with setPreferencesLS as dependency - it's stable from useEventCallback
  const setPreferences = useCallback(
    (updates: Partial<UserPreferences>) => {
      // Use current preferences from closure, not function updater form
      const next = { ...preferences, ...updates };
      setPreferencesLS(next);
    },
    [preferences, setPreferencesLS],
  );

  const value = useMemo<AuthContextType>(
    () => ({
      loggedInUser,
      setLoggedInUser: (u) => {
        setLoggedInUserLS(u);
      },
      login,
      logout,
      preferences,
      setPreferences,
    }),
    [loggedInUser, setLoggedInUserLS, login, logout, preferences, setPreferences],
  );

  // Bootstrap: ensure userPreferences is source of truth for i18n language.
  // On first mount, if userPreferences exists, sync i18n to it.
  // If no userPreferences, adopt detected i18n language and persist it.
  useEffect(() => {
    void import("../../../../i18n/i18n").then(({ default: i18n }) => {
      const storedPrefsRaw = globalThis.localStorage.getItem("userPreferences");
      const hasStoredPrefs = storedPrefsRaw !== null;
      
      if (hasStoredPrefs) {
        // userPreferences exists: it is the source of truth, sync i18n to it
        const desired = preferences.language;
        if (i18n.language !== desired) {
          void i18n.changeLanguage(desired);
        }
      } else {
        // No userPreferences yet: adopt detected i18n language and persist it
        const detected = i18n.language; // e.g., 'pt' | 'en'
        const mapped: UserPreferences["language"] = detected === "pt" ? "pt" : "en";
        if (preferences.language !== mapped) {
          setPreferences({ language: mapped });
        }
      }
    });
    // Run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep i18n language in sync when preferences change (reactive sync after bootstrap).
  useEffect(() => {
    void import("../../../../i18n/i18n").then(({ default: i18n }) => {
      const desired = preferences.language;
      if (i18n.language !== desired) {
        void i18n.changeLanguage(desired);
      }
      // Update HTML lang attribute for accessibility and SEO
      document.documentElement.lang = desired;
    });
  }, [preferences.language]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
