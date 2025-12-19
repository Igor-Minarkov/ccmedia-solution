import type { Product } from "../api/types";
import { ibuToTheme } from "../utils/ibuColor";

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[
        m
      ]!)
  );
}

export function createCard(p: Product, index: number): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `card card--${ibuToTheme(p.ibu)}`;
  btn.setAttribute("data-index", String(index));

  btn.innerHTML = `
  <div class="card__media">
    <img
      class="card__img"
      src="${p.image_url}"
      alt="${escapeHtml(p.name)}"
      loading="lazy"
    />

    <span class="card__abv">
      <span>${p.abv.toFixed(1)}%</span>
    </span>

    <span class="card__ibu">IBU: <strong>${p.ibu}</strong></span>
  </div>

  <div class="card__title">${escapeHtml(p.name)}</div>
`;

  return btn;
}
