import { createLoader } from "./loader";

export function createLoaderOverlay(): HTMLElement {
  const overlay = document.createElement("div");
  overlay.className = "loader-overlay";

  overlay.appendChild(createLoader());

  return overlay;
}
