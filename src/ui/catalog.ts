import type { Product } from "../api/types";
import { createCard } from "./card";

export function renderCatalog(
  root: HTMLElement,
  items: Product[],
  onSelect: (p: Product) => void
) {
  root.innerHTML = "";

  items.forEach((p, index) => {
    const card = createCard(p, index);

    card.addEventListener("click", () => {
      onSelect(p);
    });

    root.appendChild(card);
  });
}
