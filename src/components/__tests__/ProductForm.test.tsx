import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductForm } from '../ProductForm';
import type { Product } from '../../types/product';

// Mock the useProducts hook
jest.mock('../../hooks/useProducts', () => ({
  useProducts: () => ({
    addProduct: jest.fn(),
    updateProduct: jest.fn(),
  }),
}));

describe('ProductForm', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    category: 'Electronics',
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Test Case 1: Should render form with all required fields
  it('should render form with all required fields', () => {
    render(<ProductForm />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/stock/i)).toBeInTheDocument();
  });

  // Test Case 2: Should show validation errors for invalid inputs
  it('should show validation errors for invalid inputs', async () => {
    render(<ProductForm />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/price must be greater than 0/i)).toBeInTheDocument();
      expect(screen.getByText(/stock must be greater than or equal to 0/i)).toBeInTheDocument();
    });
  });

  // Test Case 3: Should prevent submission with invalid data
  it('should prevent submission with invalid data', async () => {
    const { useProducts } = require('../../hooks/useProducts');
    const mockAddProduct = jest.fn();
    useProducts.mockReturnValue({ addProduct: mockAddProduct });

    render(<ProductForm />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddProduct).not.toHaveBeenCalled();
    });
  });

  // Test Case 4: Should successfully add product with valid data
  it('should successfully add product with valid data', async () => {
    const { useProducts } = require('../../hooks/useProducts');
    const mockAddProduct = jest.fn();
    useProducts.mockReturnValue({ addProduct: mockAddProduct });

    render(<ProductForm />);
    
    await userEvent.type(screen.getByLabelText(/name/i), mockProduct.name);
    await userEvent.type(screen.getByLabelText(/description/i), mockProduct.description);
    await userEvent.type(screen.getByLabelText(/price/i), mockProduct.price.toString());
    await userEvent.type(screen.getByLabelText(/category/i), mockProduct.category);
    await userEvent.type(screen.getByLabelText(/stock/i), mockProduct.stock.toString());

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddProduct).toHaveBeenCalledWith(expect.objectContaining({
        name: mockProduct.name,
        price: mockProduct.price,
        stock: mockProduct.stock,
      }));
    });
  });

  // Test Case 5: Should clear form after successful submission
  it('should clear form after successful submission', async () => {
    const { useProducts } = require('../../hooks/useProducts');
    const mockAddProduct = jest.fn();
    useProducts.mockReturnValue({ addProduct: mockAddProduct });

    render(<ProductForm />);
    
    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.type(nameInput, mockProduct.name);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(nameInput).toHaveValue('');
    });
  });

  // Test Case 6: Should handle edit mode correctly
  it('should handle edit mode correctly', () => {
    render(<ProductForm product={mockProduct} />);
    
    expect(screen.getByLabelText(/name/i)).toHaveValue(mockProduct.name);
    expect(screen.getByLabelText(/description/i)).toHaveValue(mockProduct.description);
    expect(screen.getByLabelText(/price/i)).toHaveValue(mockProduct.price.toString());
    expect(screen.getByLabelText(/category/i)).toHaveValue(mockProduct.category);
    expect(screen.getByLabelText(/stock/i)).toHaveValue(mockProduct.stock.toString());
  });
}); 