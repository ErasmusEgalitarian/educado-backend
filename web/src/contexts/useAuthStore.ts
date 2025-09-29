import axios from "axios";
import create from "zustand";

import { REFRESH_TOKEN_URL } from "../helpers/environment";
import jwtHelpers from "../helpers/jwt.helpers";

interface AuthState {
  token: string | null | undefined;
  refresh: string | null | undefined;
  setToken: (input: string) => void;
  setRefresh: (input: string) => void;
  clearToken: () => void;
  getToken: () => Promise<string>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  refresh: null,
  setToken: (input: string | undefined) => {
    set((state) => ({ token: (state.token = input) }));
  },
  setRefresh: (input: string | undefined) => {
    set((state) => ({ refresh: (state.refresh = input) }));
  },
  clearToken: () => {
    set((state) => ({ token: (state.token = null) }));
  },
  getToken: async () => {
    const accessToken = get().token;
    const refreshToken = get().refresh;

    // accessToken is not expired -> token
    if (!jwtHelpers.isExpired(accessToken)) {
      return accessToken;
    }

    // Refresh the token pair with refresh token -> token
    if (!jwtHelpers.isExpired(refreshToken)) {
      // Fetch new token pairs from API
      const response = await axios.get(REFRESH_TOKEN_URL, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
      // Update state with new token pair
      set((state) => ({ token: (state.token = response.data.access) }));
      set((state) => ({ refresh: (state.refresh = response.data.refresh) }));
      return response.data.access;
    } else {
      return new Error("Could not refresh auth pairs");
    }
  },
}));

export default useAuthStore;
