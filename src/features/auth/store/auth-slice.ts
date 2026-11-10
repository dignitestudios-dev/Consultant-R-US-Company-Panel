import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "@/config/env";
import type { Company } from "@/features/company/types";

export type AuthState = {
  token: string | null;
  user: Company | null;
  /** True once localStorage has been read on the client. */
  hydrated: boolean;
};

const initialState: AuthState = { token: null, user: null, hydrated: false };

function safeSet(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
}

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrate(state) {
      try {
        state.token = window.localStorage.getItem(STORAGE_KEYS.token);
        const raw = window.localStorage.getItem(STORAGE_KEYS.user);
        state.user = raw ? (JSON.parse(raw) as Company) : null;
      } catch {
        state.token = null;
        state.user = null;
      }
      if (!state.token) state.user = null;
      state.hydrated = true;
    },
    setSession(state, a: PayloadAction<{ token: string; user?: Company | null }>) {
      state.token = a.payload.token;
      safeSet(STORAGE_KEYS.token, a.payload.token);
      if (a.payload.user !== undefined) {
        state.user = a.payload.user;
        safeSet(STORAGE_KEYS.user, a.payload.user ? JSON.stringify(a.payload.user) : null);
      }
    },
    setUser(state, a: PayloadAction<Company | null>) {
      state.user = a.payload;
      safeSet(STORAGE_KEYS.user, a.payload ? JSON.stringify(a.payload) : null);
    },
    clearSession(state) {
      state.token = null;
      state.user = null;
      safeSet(STORAGE_KEYS.token, null);
      safeSet(STORAGE_KEYS.user, null);
    },
  },
});

export const { hydrate, setSession, setUser, clearSession } = slice.actions;
export default slice.reducer;
