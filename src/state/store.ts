import type { Product } from "../api/types";

export interface AppState {
  items: Product[];
  loading: boolean;
  error: string | null;
  selected: Product | null;
  dropdownOpen: boolean;
}

type Listener = (s: AppState) => void;
type Patch = Partial<AppState> | ((s: AppState) => Partial<AppState>);

export function createStore(initial: AppState) {
  let state: AppState = { ...initial };
  const listeners = new Set<Listener>();

  return {
    get: () => state,
    set: (patch: Patch) => {
      const p = typeof patch === "function" ? patch(state) : patch;
      state = { ...state, ...p };
      listeners.forEach((l) => l(state));
    },
    subscribe: (l: Listener) => {
      listeners.add(l);
      l(state);
      return () => listeners.delete(l);
    },
  };
}
