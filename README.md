# Interactive Product Catalog – Front-End Assessment

## Overview

This project is a responsive, interactive product catalog built as part of a **Senior Front-End Developer core competency assessment**.

The application fetches product data from an external API and renders it using a **state-driven, modular architecture**, focusing on **performance, maintainability, and clarity of implementation** rather than pixel-perfect UI replication.

The solution intentionally emphasizes **fundamental front-end engineering principles** over framework-specific abstractions.

---

## Tech Stack

- **Language:** TypeScript  
- **Styling:** SCSS (modular structure with design tokens)  
- **Bundler:** Vite  

### Target Platforms
- Desktop: Chrome, Firefox, Safari  
- Mobile: iPad Safari  

### Restrictions (per assessment requirements)
- No JavaScript frameworks (React, Vue, Angular, etc.)
- No CSS frameworks (Tailwind, Bootstrap, etc.)

---

## Setup & Run

```bash
npm install
npm run dev
```

---

## Architecture & Project Structure

The codebase is organized by responsibility, not by feature size, to ensure scalability and long-term maintainability.

```text
src/
├── api/            # Data fetching and API typing
│   ├── client.ts
│   └── types.ts
│
├── state/          # Lightweight custom state management
│   └── store.ts
│
├── ui/             # UI rendering modules
│   ├── catalog.ts
│   ├── card.ts
│   ├── modal.ts
|   ├── loader.ts
|   ├── loaderOverlay.ts
│   ├── dropdown.ts
│   └── status.ts
│
├── utils/          # Reusable helpers
│   ├── escapeHtml.ts
│   └── ibuColor.ts
│
├── styles/
│   ├── tokens.scss     # Design tokens (colors, spacing, radius, shadows)
│   ├── catalog.scss
|   ├── dropdown.scss
│   ├── modal.scss
│   ├── loader.scss
│   └── base.scss
│
└── main.ts
```

---

## Application Bootstrap

### Architectural Principles

- Clear separation of concerns
- Deterministic, state-driven rendering
- No hidden global state
- Modular and reusable UI logic
- Minimal DOM mutations per render cycle

The project intentionally avoids external state or UI libraries to demonstrate core front-end engineering skills without framework abstractions.

---

## State Management

A custom lightweight store is implemented to manage application state.

### Responsibilities

- Product data
- Loading and error states
- Modal selection state
- UI interaction state (dropdown open/close)

### Trade-off

A small custom store was chosen instead of external libraries to:
- Avoid unnecessary abstraction
- Keep state transitions explicit and easy to reason about
- Demonstrate understanding of state management fundamentals

This approach is sufficient for the dataset size and interaction complexity of the assessment.

---

## Data Fetching & Error Handling

- Product data is fetched on application load from the provided API endpoint
- AbortController is used to cancel in-flight requests on reload
- Explicit loading and error states are rendered to the UI
- Errors are displayed in a user-friendly manner with retry support

### Trade-off

Data is intentionally not persisted or cached, as required by the assessment.  
Each page load performs a fresh fetch to ensure deterministic behavior.

---

## Rendering & Performance

- Responsive layout implemented using CSS Grid (4 / 3 / 2 / 1 columns)
- DOM updates are centralized through a single render cycle
- Event delegation is used where appropriate
- Product images use native loading="lazy" for improved performance

---

## Performance Considerations

The rendering strategy minimizes layout thrashing and avoids unnecessary reflows, ensuring smooth performance even on lower-powered devices.

---

## Dynamic Theming (IBU-Based)

Each product card dynamically adapts its background theme based on the numeric IBU value.

IBU values are mapped to semantic theme levels:
- low
- mid
- high
- extreme

All colors are defined via SCSS design tokens.

### Trade-off

Theme assignment is handled via CSS classes, not inline styles, to:
- Keep styling concerns within stylesheets
- Enable centralized theming
- Allow future extensions (e.g. dark mode)

---

## Modal Component

- State-driven modal rendering
- Body scroll locking while modal is open

### Close mechanisms
- Backdrop click
- ESC key
- Close button

Clean teardown on close prevents memory leaks.  
The modal is rendered only when needed, keeping the DOM lightweight.

---

## Two-Level Dropdown Component

A reusable two-level dropdown is implemented for the ordering action.

- Config-driven structure (groups → children)
- Opens only via explicit user interaction
- Supports hover and click navigation
- Closes automatically on selection or outside click

### Trade-off

A custom dropdown was implemented instead of using a library to demonstrate:
- Full control over interaction logic
- Predictable state handling
- Framework-agnostic UI composition

The right panel is intentionally populated only after a group is selected, following standard multi-level menu UX patterns.

---

## Styling Strategy

- SCSS is used for maintainability and modularity
- Shared values are centralized in design tokens
- No inline styles (except where unavoidable for dynamic behavior)
- Transitions are subtle to avoid visual noise

The styling approach prioritizes clarity, consistency, and ease of extension over visual excess.

---

## Accessibility Notes

- Semantic HTML elements are used where applicable
- Modal includes role="dialog" and aria-modal

### Keyboard support
- ESC closes modal and dropdown
- Click-outside handling for overlays

---

## Known Limitations

- Filtering/search functionality not implemented (optional feature)
- No list virtualization (dataset size is small)
- Minimal animations by design to prioritize performance
- Modal uses page scroll while open (intentional for usability on smaller screens). Ideally, the two-level dropdown would “flip” upward when close to the viewport edge.
- Safari not tested due to lack of access to a Safari testing environment (e.g., BrowserStack/LambdaTest).
- Shadows are kept as fixed values as they represent elevation rather than brand theming.
