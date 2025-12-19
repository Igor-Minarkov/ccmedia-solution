export type DropdownOption = { label: string; value: string };

export type TwoLevelDropdownConfig = {
  groups: Array<{
    label: string;
    value: string;
    children: DropdownOption[];
  }>;
};

type State = {
  open: boolean;
  activeGroupIndex: number;
};

export function createTwoLevelDropdown(
  config: TwoLevelDropdownConfig,
  onSelect: (groupValue: string, childValue: string) => void
) {
  const root = document.createElement("div");
  root.className = "ddl";

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "ddl__trigger";
  trigger.textContent = "Order";

  const pop = document.createElement("div");
  pop.className = "ddl__pop";
  pop.hidden = true;

  const left = document.createElement("div");
  left.className = "ddl__panel ddl__panel--left";

  const right = document.createElement("div");
  right.className = "ddl__panel ddl__panel--right";

  pop.append(left, right);
  root.append(trigger, pop);

  const state: State = { open: false, activeGroupIndex: 0 };

  // handlers for cleanup
  const onDocClick = (e: MouseEvent) => {
    if (!root.contains(e.target as Node)) close();
  };

  const onDocKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") close();
  };

  function bindGlobal() {
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onDocKey);
  }

  function unbindGlobal() {
    document.removeEventListener("click", onDocClick);
    document.removeEventListener("keydown", onDocKey);
  }

  function positionRightToActive() {
    const active = left.querySelector<HTMLElement>(
      `.ddl__item[data-index="${state.activeGroupIndex}"]`
    );
    if (!active) return;

    const popRect = pop.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();

    const top = activeRect.top - popRect.top;

    right.style.top = `${top}px`;
  }

  function renderLeft() {
    left.innerHTML = "";
    config.groups.forEach((g, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ddl__item";
      btn.dataset.index = String(i);

      btn.innerHTML = `
        <span class="ddl__label">${escapeHtml(g.label)}</span>
        <span class="ddl__chev">›</span>
      `;

      btn.addEventListener("click", () => {
        state.activeGroupIndex = i;
        right.hidden = false;
        renderRight();
        highlightLeft();
        positionRightToActive();
      });

      left.appendChild(btn);
    });

    highlightLeft();
  }

  function highlightLeft() {
    left.querySelectorAll<HTMLElement>(".ddl__item").forEach((el) => {
      const i = Number(el.dataset.index);
      el.classList.toggle("is-active", i === state.activeGroupIndex);
      el.setAttribute(
        "aria-current",
        i === state.activeGroupIndex ? "true" : "false"
      );
    });
  }

  function renderRight() {
    right.innerHTML = "";
    const group = config.groups[state.activeGroupIndex];

    group.children.forEach((c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ddl__item ddl__item--child";
      btn.textContent = c.label;

      btn.addEventListener("click", () => {
        onSelect(group.value, c.value);
        close();
      });

      right.appendChild(btn);
    });
  }

  function open() {
    if (state.open) return;
    state.open = true;
    pop.hidden = false;
    root.classList.add("is-open");
    bindGlobal();

    if (!right.hidden) positionRightToActive();
  }

  function close() {
    if (!state.open) return;
    state.open = false;
    pop.hidden = true;
    right.hidden = true;
    right.innerHTML = "";
    root.classList.remove("is-open");
    unbindGlobal();
  }

  function toggle() {
    state.open ? close() : open();
  }

  // Trigger
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle();
  });

  // Prevent inside clicks from bubbling to doc handler
  pop.addEventListener("click", (e) => e.stopPropagation());

  right.hidden = true;
  renderLeft();

  return {
    el: root,
    setLabel(text: string) {
      trigger.textContent = text;
    },
    close,
    destroy() {
      unbindGlobal();
    },
  };
}

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[m]!)
  );
}
