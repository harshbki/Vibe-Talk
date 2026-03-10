# Vibe-Talk Project Conventions

Vibe-Talk is a MERN-stack real-time chat app. The repo has two packages:

- `client/` — React 18 SPA (Create React App, ESM)
- `server/` — Node.js/Express API + Socket.IO (CommonJS)

## Module systems

- **Client**: ESM only — use `import`/`export default`/`export`.
- **Server**: CommonJS only — use `require()`/`module.exports`.
  Never mix module systems within a package.

## Async style

Always use `async/await` with `try/catch/finally`. Never use `.then()`/`.catch()` chains.

```js
// ✅
const data = await fetchUser(id);

// ❌
fetchUser(id).then(data => ...);
```

## Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Variables & functions | camelCase | `currentUser`, `handleSubmit` |
| React components & files | PascalCase | `MessageInput`, `ChatWindow.js` |
| Server files/modules | camelCase | `chatController.js`, `authRoutes.js` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_FILE_SIZE` |
| Event handlers | `handleXxx` | `handleChange`, `handleFileUpload` |

## Error handling

- Client: log errors with `console.error(label, error)` and show user feedback via state.
- Server: pass unexpected errors to `next(error)` so the global `errorHandler` middleware catches them.
- Never swallow errors silently.

## Environment variables

- All secrets live in `.env` (never committed).
- Server reads variables with `process.env.VARIABLE_NAME` after `require('dotenv').config()`.
- Client uses `process.env.REACT_APP_*` (CRA convention).
