import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Home page', () => {
  render(<App />);
  expect(screen.getByText('Home')).toBeInTheDocument();
});
