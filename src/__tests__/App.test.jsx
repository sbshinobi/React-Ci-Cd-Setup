import { fireEvent, render, screen } from '@testing-library/react';

import App from '../App';
import { expect } from 'vitest';
test('should render App component', () => {
  render(<App />);
  screen.debug();
  const headerElement = screen.getByText(/Vite \+ React/i);

  expect(headerElement).toBeInTheDocument();
});
test('should render App component', () => {
  render(<App />);
  screen.debug();
  const buttonElement = screen.getByText(/count is 0/i);
  expect(buttonElement).toBeInTheDocument();
  fireEvent(buttonElement, 'click');
  expect(buttonElement).toHaveTextContent(/count is 1/i);
  fireEvent(buttonElement, 'click');
  expect(buttonElement).toHaveTextContent(/count is 2/i);
  fireEvent(buttonElement, 'click');  
});