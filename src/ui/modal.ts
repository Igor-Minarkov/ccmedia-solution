import type { Product } from "../api/types";
import { escapeHtml } from "../utils/escapeHtml";
import {
  createTwoLevelDropdown,
  type TwoLevelDropdownConfig,
} from "./dropdown";

export function renderModal(
  root: HTMLElement,
  product: Product | null,
  onClose: () => void
) {
  let dropdown: ReturnType<typeof createTwoLevelDropdown> | null = null;

  function close() {
    cleanup();
    onClose();
  }

  function cleanup() {
    dropdown?.destroy();
    dropdown = null;
    document.body.style.overflow = "";
    root.innerHTML = "";
    window.removeEventListener("keydown", onEsc);
  }

  function onEsc(e: KeyboardEvent) {
    if (e.key === "Escape") close();
  }

  if (!product) {
    cleanup();
    return;
  }

  document.body.style.overflow = "hidden";

  root.innerHTML = `
    <div class="modal-backdrop" data-backdrop>
      <div class="modal modal--hero-notch" role="dialog" aria-modal="true" aria-label="Product details">
        <button class="modal__close" aria-label="Close" data-close>✕</button>

        <div class="modal__left">
          <div class="modal__hero">
            <div class="modal__fill"></div>
            <div class="modal__ring"></div>

            <span class="modal__ibu">
              IBU:<strong>${product.ibu}</strong>
            </span>

            <img
              class="modal__img"
              src="${product.image_url}"
              alt="${escapeHtml(product.name)}"
            />

            <div class="modal__abv">
              <strong>${Number(product.abv).toFixed(1)}</strong><span>%</span>
            </div>
          </div>

          <h4 class="modal__title">${escapeHtml(product.name)}</h4>
        </div>

        <div class="modal__right">
          <p class="modal__desc">${escapeHtml(product.description)}</p>

          <div class="modal__actions">
            <!-- dropdown goes here -->
          </div>
        </div>
      </div>
    </div>
  `;

  const dropdownConfig: TwoLevelDropdownConfig = {
    groups: [
      {
        label: "Glass",
        value: "Glass",
        children: [
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3", value: "3" },
        ],
      },
      {
        label: "Can",
        value: "Can",
        children: [
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3", value: "3" },
        ],
      },
      {
        label: "Box",
        value: "Box",
        children: [
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3", value: "3" },
        ],
      },
    ],
  };

  const actionsEl = root.querySelector<HTMLElement>(".modal__actions");
  if (!actionsEl) throw new Error("Missing .modal__actions in modal");

  dropdown = createTwoLevelDropdown(dropdownConfig, (pack, qty) => {
    dropdown?.setLabel(`${pack} × ${qty}`);
    console.log("ORDER:", product.name, pack, qty);
  });

  actionsEl.appendChild(dropdown.el);

  root.querySelector("[data-close]")?.addEventListener("click", close);

  const backdrop = root.querySelector("[data-backdrop]");
  backdrop?.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });

  window.addEventListener("keydown", onEsc);
}
