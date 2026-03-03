// This file is used to set up the testing environment for Vitest.

// Extends Vitest's `expect` with custom matchers from jest-dom,
// allowing for more expressive assertions on DOM nodes.
// For example: expect(element).toBeInTheDocument();
import '@testing-library/jest-dom';
