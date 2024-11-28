import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App'; // Adjust the path as necessary

test('renders card game title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Card Game/i);
  expect(titleElement).toBeInTheDocument();
});