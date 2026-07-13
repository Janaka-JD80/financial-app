# A Friendly Guide to Testing in Your App 🧪

If you have never written or run automated tests before, don't worry! This guide will explain what they are, why we use them, and how they work in your app in a simple, friendly way.

---

## 1. What is Automated Testing?
Imagine you are building a house. Every time you add a new room, you want to make sure you didn't accidentally cut the power line to the kitchen. 
Instead of walking to the kitchen and turning on the light switch yourself every single day, you hire a robot assistant to do it for you.

In web development, **Automated Testing** is that robot assistant. We write small scripts (called "tests") that automatically click buttons, fill out forms, and check that numbers match up, ensuring your code remains stable and bug-free.

We use two primary tools for this:
1. **Jest**: The manager. It finds our test files, runs them, and reports whether they passed or failed.
2. **React Testing Library**: The virtual smartphone/browser. It renders your pages inside a sandbox so Jest can "see" what is on the screen.

---

## 2. The Concept of "Mocking" (Stunt Doubles 🎭)
Our pages normally fetch real data from your Supabase database. However, during tests:
* We don't want to connect to a real database (what if the internet is down, or we accidentally delete real data?).
* We don't want to load heavy visual libraries like charts (which slow down the tests).

To solve this, we use **Mocking**. Think of it as using **stunt doubles** in a movie. 

Instead of calling the real database hook, we tell Jest: 
> *"When the app asks for accounts, don't talk to Supabase. Just hand it this dummy list containing one bank account with $1,000 in it."*

### How it looks in the code:
```typescript
// 1. Tell Jest to intercept the real database file
jest.mock('../../hooks/useApi');

// 2. Setup the stunt double
mockUseAccounts.mockReturnValue({
  data: [{ id: '1', name: 'My Bank Account', balance: 1000 }],
  isLoading: false,
});
```

---

## 3. How to Read a Test File
When you open a test file (like `Reports.test.tsx`), you will see three main building blocks:

### 1. `describe` (The Category)
Groups related tests together.
```typescript
describe('Reports Page', () => {
  // All reports-related tests go inside here...
});
```

### 2. `beforeEach` (The Clean Slate)
Runs before **each** individual test to clean up and set up the fake database data.
```typescript
beforeEach(() => {
  jest.clearAllMocks(); // Clear memory from previous tests
  mockUseAccounts.mockReturnValue(...); // Load fresh fake data
});
```

### 3. `it` or `test` (The Experiment)
This is where the actual testing happens. We render the page, look for things on the screen, and state our expectations.
```typescript
it('renders the title', () => {
  render(<Reports />); // Render page in virtual browser
  
  // Find "Reports" on screen and expect it to be there!
  expect(screen.getByText('Reports')).toBeInTheDocument(); 
});
```

---

## 4. Testing Glossary
Here are the most common commands you will see in our test files:
* **`render(<Component />)`**: Places the component inside the testing sandbox.
* **`screen.getByText('Hello')`**: Searches the screen for the word "Hello". If it can't find it, it stops and fails the test.
* **`screen.getByTestId('bar-chart')`**: Searches for custom element tags (like our mock charts) using a specific ID.
* **`fireEvent.click(button)`**: Simulates a user clicking on a button.
* **`toBeInTheDocument()`**: A checklist item saying "Verify this element is visible on the screen".

---

## 5. How to Run the Tests
Whenever you make changes to the app, you can run all tests to verify everything is safe:

1. Open your terminal in the `financial-app` folder.
2. Run the command:
   ```bash
   npm run test
   ```
3. Jest will start up, scan your project, run all 17 tests, and print a summary table of results.
