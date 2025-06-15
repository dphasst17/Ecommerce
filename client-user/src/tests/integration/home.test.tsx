import { act, render, screen } from '@testing-library/react';
import Home from '../../pages/home/index';
// Mock các component được import vào trong Home
jest.mock('../../pages/home/slide', () => () => <div data-testid="slideshow">Slideshow Component</div>);
jest.mock('../../pages/home/sale', () => () => <div data-testid="saleevent">SaleEvent Component</div>);
jest.mock('../../pages/home/newProduct', () => () => <div data-testid="newproduct">NewProduct Component</div>);
jest.mock('../../pages/home/laptop', () => () => <div data-testid="laptop">Laptop Component</div>);
jest.mock('../../pages/home/post', () => () => <div data-testid="post">Post Component</div>);

test('renders home page with all components', async() => {
  await act(async () => {
    render(<Home />);
  });
  expect(screen.getByTestId('slideshow')).toBeInTheDocument();
  expect(screen.getByTestId('saleevent')).toBeInTheDocument();
  expect(screen.getByTestId('newproduct')).toBeInTheDocument();
  expect(screen.getByTestId('laptop')).toBeInTheDocument();
  expect(screen.getByTestId('post')).toBeInTheDocument();
});
