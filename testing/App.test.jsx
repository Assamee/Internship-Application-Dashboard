import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../src/App.jsx'; // No need for { } because the App component is the default export

// Things to test:
// 1. Render the initial 4 companies
// 2. Search (typing filters rows + the company/role toggle)
// 3. Adding a new application
// 4. Edit an existing application
// 5. Delete an application (Confirm removes a row/Cancel doesn't)
// 6. Persistance (localStorage)

beforeEach(() => {
    localStorage.clear();
});

// Test 1: Render the initial 4 companies

describe("Render the initial applications", () => {
    it("Renders the initial applications", () => {
        render(<App />);
        expect(screen.getByText("Software Engineering Intern")).toBeInTheDocument();
    });
});