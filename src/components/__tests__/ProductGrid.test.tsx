import { render, screen, fireEvent } from '@testing-library/react';
import { ProductGrid } from '../ProductGrid';
import type { Product } from '../../types/product';

// Mock the useProducts hook
jest.mock('../../hooks/useProducts', () => ({
  useProducts: () => ({
    products: [],
    deleteProduct: jest.fn(),
  }),
}));

describe('ProductGrid', () => {
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Test Product 1',
      description: 'Test Description 1',
      price: 99.99,
      category: 'Electronics',
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Test Product 2',
      description: 'Test Description 2',
      price: 149.99,
      category: 'Clothing',
      stock: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Test Case 1: Should render products correctly
  it('should render products correctly', () => {
    const { useProducts } = require('../../hooks/useProducts');
    useProducts.mockReturnValue({ products: mockProducts });

    render(<ProductGrid products={mockProducts} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('$149.99')).toBeInTheDocument();
  });

  // Test Case 2: Should handle empty state
  it('should handle empty state', () => {
    const { useProducts } = require('../../hooks/useProducts');
    useProducts.mockReturnValue({ products: [] });

    render(<ProductGrid products={[]} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  // Test Case 3: Should display product information accurately
  it('should display product information accurately', () => {
    const { useProducts } = require('../../hooks/useProducts');
    useProducts.mockReturnValue({ products: [mockProducts[0]] });

    render(<ProductGrid products={[mockProducts[0]]} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.getByText(mockProducts[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockProducts[0].description)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProducts[0].price}`)).toBeInTheDocument();
    expect(screen.getByText(mockProducts[0].category)).toBeInTheDocument();
    expect(screen.getByText(`Stock: ${mockProducts[0].stock}`)).toBeInTheDocument();
  });

  // Test Case 4: Should handle image loading errors
  it('should handle image loading errors', () => {
    const { useProducts } = require('../../hooks/useProducts');
    useProducts.mockReturnValue({ products: [mockProducts[0]] });

    render(<ProductGrid products={[mockProducts[0]]} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    const productImage = screen.getByRole('img');
    fireEvent.error(productImage);
    
    expect(screen.getByAltText(/product image/i)).toHaveAttribute('src', expect.stringContaining('placeholder'));
  });
}); 