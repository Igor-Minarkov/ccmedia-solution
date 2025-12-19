import { createLoader } from "./loader";

export function renderStatus(
  el: HTMLElement,
  state: { loading: boolean; error: string | null },
  onRetry: () => void
) {
  el.innerHTML = "";

  if (state.loading) {
    el.appendChild(createLoader());
    return;
  }

  if (state.error) {
    el.innerHTML = `
      <div class="status status--error">
        <strong>Could not load products</strong>
        <div class="status__msg">${escapeHtml(state.error)}</div>
        <button class="btn" type="button" data-retry>Retry</button>
      </div>
    `;

    el.querySelector<HTMLButtonElement>("[data-retry]")?.addEventListener(
      "click",
      onRetry
    );

    return;
  }
}

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[
        m
      ]!)
  );
}
