import "./styles/base.scss";

import { fetchProducts } from "./api/client";
import { createStore } from "./state/store";
import { renderStatus } from "./ui/status";
import { renderCatalog } from "./ui/catalog";
import { renderModal } from "./ui/modal";
import { createLoaderOverlay } from "./ui/loaderOverlay";

// DOM refs
function mustGetEl(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLElement)) {
    throw new Error(`Missing #${id} in index.html`);
  }
  return el;
}

const statusEl = mustGetEl("status");
const gridEl = mustGetEl("grid");
const modalRoot = mustGetEl("modal-root");

// Store
const store = createStore({
  items: [],
  loading: false,
  error: null,
  selected: null,
  dropdownOpen: false,
});

let aborter: AbortController | null = null;

let overlay: HTMLElement | null = null;

function showOverlay() {
  if (overlay) return;
  overlay = createLoaderOverlay();
  document.body.appendChild(overlay);
}

function hideOverlay() {
  overlay?.remove();
  overlay = null;
}

function render() {
  const s = store.get();

  // Status (only errors; loader is overlay)
  if (!statusEl) return;
  renderStatus(statusEl, { loading: false, error: s.error }, load);

  // Catalog
  renderCatalog(gridEl, s.items, (product) => {
    store.set({ selected: product });
  });

  // Modal
  renderModal(modalRoot, s.selected, () => {
    store.set({ selected: null, dropdownOpen: false });
  });
}

store.subscribe(render);

async function load() {
  aborter?.abort();
  aborter = new AbortController();

  store.set({ loading: true, error: null });
  showOverlay();

  try {
    const items = await fetchProducts(aborter.signal);
    store.set({ items, loading: false });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    store.set({ error: msg, loading: false });
  } finally {
    hideOverlay();
  }
}

load();
