import { fireEvent, render, screen } from '@testing-library/react';

import App from '../App';
import { expect } from 'vitest';
test('should render App component', () => {
  render(<App />);
  screen.debug();
  const headerElement = screen.getByText(/Vite \+ React/i);

  expect(headerElement).toBeInTheDocument();
});

