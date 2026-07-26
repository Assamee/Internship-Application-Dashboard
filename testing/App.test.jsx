import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../src/App.jsx'; // No need for { } because the App component is the default export

// Things to test:
// 1. Render the initial applications (the test data)
// 2. Search (typing filters rows + the company/role toggle)
// 3. Adding a new application
// 4. Edit an existing application
// 5. Delete an application (Confirm removes a row/Cancel doesn't)
// 6. Persistance (localStorage)

const testdata = JSON.stringify(
    [
        {
            id: 1,
            company: "Barclays",
            role: "Technology Developer Intern",
            status: "Offer Received!",
        },
        {
            id: 2,
            company: "Google",
            role: "Software Engineer Intern",
            status: "Interview",
        },
        {
            id: 3,
            company: "Microsoft",
            role: "Product Manager Intern",
            status: "Yet to Apply",
        }
    ]
);

beforeEach(() => {
    localStorage.clear();

    localStorage.setItem('dashboard_applications', testdata);

});



// Test 1: Render the initial applications

describe("Render the initial applications", () => {
    it("Renders the initial applications", () => {
        render(<App />);
        expect(screen.getByText(/Barclays/i)).toBeInTheDocument();
        expect(screen.getByText(/Google/i)).toBeInTheDocument();
        expect(screen.getByText(/Microsoft/i)).toBeInTheDocument();
    });
});
