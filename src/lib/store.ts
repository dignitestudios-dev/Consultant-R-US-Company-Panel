"use client";

import { useSyncExternalStore } from "react";

export type Company = {
  name: string;
  industry: string;
  location: string;
  description: string;
};

type State = { favorites: number[]; company: Company };

const KEY = "crus-company-portal-v1";

// Prototype data. Replace with API calls when the backend is available.
const DEFAULT: State = {
  favorites: [1, 3],
  company: {
    name: "Sample Oilfield Services",
    industry: "Oil and gas completions",
    location: "Houston, TX",
    description:
      "A sample company profile for this prototype. Describe your operations, regions, and the consultants you typically hire.",
  },
};

let state: State = DEFAULT;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<State>;
      state = {
        favorites: Array.isArray(parsed.favorites) ? parsed.favorites : DEFAULT.favorites,
        company: { ...DEFAULT.company, ...parsed.company },
      };
    }
  } catch {
    /* storage unavailable: keep defaults */
  }
}

function commit(next: State) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => {
  load();
  return state;
};
const getServerSnapshot = () => DEFAULT;

export const useStore = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export const actions = {
  /** Returns true when the consultant is now a favorite. */
  toggleFavorite(id: number) {
    load();
    const on = state.favorites.includes(id);
    commit({
      ...state,
      favorites: on ? state.favorites.filter((x) => x !== id) : [...state.favorites, id],
    });
    return !on;
  },
  setCompany(patch: Partial<Company>) {
    load();
    commit({ ...state, company: { ...state.company, ...patch } });
  },
};
