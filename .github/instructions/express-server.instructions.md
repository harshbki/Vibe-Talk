---
description: "Use when creating or modifying server-side code: Express routes, controllers, Mongoose models, middleware, or Socket.IO handlers."
applyTo: "server/**"
---
# Express / Node Server Conventions

## Module system

CommonJS only. Always `require`/`module.exports` — never `import`/`export`.

```js
const express = require('express');
module.exports = router;
```

## MVC layout

```
server/
├── server.js        # Entry: app setup, middleware, route mounting
├── routes/          # Thin routers — only route definitions
├── controllers/     # Business logic, async handlers
├── models/          # Mongoose schemas/models
├── middleware/       # Auth, rate limiter, error handler, etc.
├── socket/          # Socket.IO setup (setupSocket)
└── utils/           # Pure helper functions
```

- **Routes are thin**: only import the controller and call `router.METHOD(path, handler)`.
- **Controllers hold logic**: query the DB, call services, and respond.

## Express Router pattern

```js
// routes/chatRoutes.js
const router = require('express').Router();
const { getOrCreateChat, getChatMessages } = require('../controllers/chatController');

router.post('/', getOrCreateChat);
router.get('/:chatId/messages', getChatMessages);

module.exports = router;
```

Mount in `server.js` with a prefix:

```js
app.use('/api/chat', chatRoutes);
```

## Async controller pattern

Wrap async route handlers in try/catch and forward errors:

```js
const getChatMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};
```

## Error handling

- The global `errorHandler` middleware is mounted **last** in `server.js`.
- Always call `next(error)` for unexpected errors — never `res.status(500).send()` directly.
- For known validation/auth errors, respond directly with an appropriate status code.

## Socket.IO

- All Socket.IO logic lives in `socket/` and is initialized via `setupSocket(io)`.
- Do not put socket event listeners inside route controllers.

## Security

- Rate-limit sensitive endpoints (auth routes) via `express-rate-limit`.
- Validate and sanitize all user inputs before DB operations.
- Never expose stack traces to the client in production (`NODE_ENV === 'production'`).

## Mongoose models

- One model per file, named after the resource (e.g., `User.js`, `Message.js`).
- Define schema first, then compile model: `const User = mongoose.model('User', userSchema)`.
- Use Mongoose validation (e.g., `required`, `enum`) rather than validating in controllers.
