export function createLoader(): HTMLElement {
  const el = document.createElement("div");
  el.className = "loader-spinner";
  el.setAttribute("role", "status");
  el.setAttribute("aria-label", "Loading");
  return el;
}
