---
description: "Use when writing, reviewing, or fixing tests for the Vibe-Talk project. Covers Jest, React Testing Library, and server-side unit tests."
---
# Testing Conventions

## Client tests (Jest + React Testing Library)

The CRA setup includes Jest. Run with `npm test` inside `client/`.

### File location

Co-locate test files next to the source file:

```
client/src/
└── components/
    ├── MessageInput.js
    └── MessageInput.test.js
```

### AAA pattern

Structure every test as Arrange → Act → Assert:

```js
it('sends a message on form submit', async () => {
  // Arrange
  const mockSendMessage = jest.fn();
  render(<MessageInput />, { wrapper: createWrapper({ sendMessage: mockSendMessage }) });

  // Act
  await userEvent.type(screen.getByRole('textbox'), 'hello');
  await userEvent.click(screen.getByRole('button', { name: /send/i }));

  // Assert
  expect(mockSendMessage).toHaveBeenCalledWith(expect.objectContaining({ content: 'hello' }));
});
```

### Wrapping context providers

Create a helper wrapper so tests can supply context values:

```js
const createWrapper = (chatOverrides = {}) => ({ children }) => (
  <AuthContext.Provider value={mockAuthValue}>
    <ChatContext.Provider value={{ ...mockChatValue, ...chatOverrides }}>
      {children}
    </ChatContext.Provider>
  </AuthContext.Provider>
);
```

### Querying elements

Prefer accessible queries in priority order:

1. `getByRole` (most resilient)
2. `getByLabelText`
3. `getByText`
4. `getByTestId` (last resort — add `data-testid` sparingly)

### Mocking

- Mock Axios and Socket.IO client with `jest.mock('axios')`.
- Mock `uploadMedia` and other API helpers at the module level.
- Reset mocks between tests with `beforeEach(() => jest.clearAllMocks())`.

## Server tests (Jest)

Add a `jest` config to `server/package.json` and run tests with `npm test` inside `server/`.

### What to test

- **Controllers**: mock Mongoose models, assert correct response status and body.
- **Middleware**: unit-test auth and error-handler functions in isolation.
- **Models**: test schema validators (required fields, enum values) with an in-memory Mongo db (`mongodb-memory-server`).

### Controller test pattern

```js
const { getChatMessages } = require('../../controllers/chatController');

jest.mock('../../models/Message');

it('returns messages for a chat', async () => {
  const mockMessages = [{ content: 'hi' }];
  Message.find.mockResolvedValue(mockMessages);

  const req = { params: { chatId: '123' } };
  const res = { json: jest.fn() };
  const next = jest.fn();

  await getChatMessages(req, res, next);

  expect(res.json).toHaveBeenCalledWith(mockMessages);
  expect(next).not.toHaveBeenCalled();
});
```

## General rules

- Tests must be deterministic — no reliance on network, real DB, or wall-clock time.
- One assertion concept per `it` block (multiple `expect` calls that verify the same behaviour are fine).
- Describe blocks group related tests: `describe('MessageInput', () => { ... })`.
- Test descriptions use plain language: `'shows error when file is too large'`.
