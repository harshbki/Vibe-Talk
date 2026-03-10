---
description: "Use when creating or modifying React components, pages, context providers, hooks, or any client-side UI code in the Vibe-Talk frontend."
applyTo: "client/src/**"
---
# React Component Conventions

## Component style

- **Functional components only** — no class components.
- Declare with `const`, export as default at the bottom.

```js
const MessageInput = () => {
  // ...
};

export default MessageInput;
```

## Hooks

- State: `useState` for local state, `useReducer` for complex state objects.
- Side effects: `useEffect` with an explicit dependency array.
- DOM refs: `useRef`.
- Global state: consume via custom context hooks (`useAuth`, `useChat`) — do not import context directly.
- Do not call hooks conditionally or inside loops.

## Global state (Context API)

- Wrap providers in `App.js`: `<AuthProvider><ChatProvider>...`.
- Export a custom hook alongside each context (`useAuth`, `useChat`).
- No Redux — Context API is the only state management.

## File and folder structure

```
client/src/
├── components/   # Reusable UI pieces
├── pages/        # Route-level components
├── context/      # Context + custom hooks
├── api/          # Axios calls
└── App.js
```

- One component per file, filename matches component name (`MessageInput.js`).
- Co-locate a CSS file for each component that needs non-Tailwind styles (`MessageInput.css`).

## Styling

- Prefer **Tailwind CSS** and **DaisyUI** utility classes.
- Use a co-located `.css` file only for styles that can't be expressed with utilities.
- Never use inline `style={{}}` objects except for dynamic values (e.g., percentage widths).

## Routing

- Use React Router v6: `<Routes>`, `<Route>`, `<Navigate>`.
- Private routes wrap children: `<PrivateRoute><Dashboard /></PrivateRoute>`.

## Event handlers

- Name as `handleXxx`: `handleSubmit`, `handleChange`, `handleFileUpload`.
- Use arrow functions assigned to `const`.

```js
const handleSubmit = (e) => {
  e.preventDefault();
  // ...
};
```

## Imports order (within a file)

1. React imports
2. Third-party libraries
3. Internal context/hooks
4. Local components / pages
5. Utilities / API calls
6. Styles
