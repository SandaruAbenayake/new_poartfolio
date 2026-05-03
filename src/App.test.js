import { render, screen } from '@testing-library/react';
import App from './App';

test('renders portfolio accessibility content', () => {
  render(<App />);
  expect(screen.getAllByRole('heading', { name: /sandaru abenayake/i }).length).toBeGreaterThan(0);
  expect(screen.getByRole('heading', { name: /selected work/i })).toBeInTheDocument();
});
