# Jest Testing Documentation

This document explains how **Jest** and **React Testing Library** are configured, how hooks are mocked, and provides explanations for testing syntax.

## Testing Stack & Configuration

Testing is configured in [jest.config.js](file:///d:/My/financial-app/jest.config.js). Key features:
- **`jsdom` Environment**: Simulates a browser-like DOM environment within Node.js, allowing React components to render.
- **`ts-jest` Preprocessor**: Compiles TypeScript files (`.ts`, `.tsx`) on-the-fly during test runs.
- **Module Mocks**: Assets, CSS modules, and `lucide-react` icons are mocked using stub files or identity proxies to prevent Jest from throwing errors when loading static styles or layouts.

---

## Mocking React Query & APIs

Since our page containers fetch data using custom hooks from `src/hooks/useApi`, we mock those hooks in tests to prevent making network requests to Supabase.

Example pattern:
```typescript
// 1. Declare the mock
jest.mock('../../hooks/useApi');

// 2. Cast hook functions as jest.Mock
const mockUseAccounts = useAccounts as jest.Mock;

// 3. Mock resolved values in beforeEach block
mockUseAccounts.mockReturnValue({
  data: [{ id: '1', name: 'My Bank', type: 'bank', balance: 1000 }],
  isLoading: false,
});
```

---

## Testing Syntax Reference

Here is a breakdown of testing functions and assertions used in the project:

### 1. Structure Functions
- **`describe(name, fn)`**: Groups related tests into blocks. For example: `describe('Dashboard', () => { ... })`.
- **`it(name, fn)` or `test(name, fn)`**: Represents an individual test case. It should describe a specific requirement (e.g. `it('renders loading state initially')`).
- **`beforeEach(fn)`**: Runs a setup function before each test case in the describe block. Used to reset mock returns and clear histories.

### 2. Mocking Functions
- **`jest.mock(path)`**: Replaces the module at the specified path with a set of mock functions.
- **`jest.fn()`**: Creates a mock function that tracks arguments, calls, and return values (spies). Commonly used for button click handlers or mutation triggers: `mutate: jest.fn()`.
- **`mockReturnValue(val)`**: Configures what a mock function returns when called.
- **`mockResolvedValueOnce(val)`**: Configures a mock function to return a resolved promise containing the specified value once. Useful for mocking async API calls.

### 3. Rendering & Assertion Helpers
- **`render(ui)`**: Renders a React component into the simulated jsdom container.
- **`screen`**: An object containing query functions to find elements in the rendered DOM:
  - `screen.getByText('Text')`: Finds an element containing the exact text. Throws an error if not found.
  - `screen.queryByText('Text')`: Finds an element. Returns `null` if not found (ideal for asserting an element is absent).
  - `screen.getByRole('button', { name: 'Sign in' })`: Finds a button with the specific accessible text.
- **`fireEvent`**: Simulates browser events:
  - `fireEvent.click(button)`: Triggers a click.
  - `fireEvent.change(input, { target: { value: 'text' } })`: Simulates typing.
- **`expect(element).toBeInTheDocument()`**: Asserts that a found element is present in the document.
- **`expect(mockFn).toHaveBeenCalledWith(args)`**: Asserts that a mock function was called with specific arguments.
- **`waitFor(fn)`**: Retries the callback until assertions inside it pass. Used for waiting on async actions or DOM updates.
