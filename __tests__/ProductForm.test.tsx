import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductForm } from '../components/ProductForm';
import { CATEGORIES } from '../constants';
import userEvent from '@testing-library/user-event';

describe('ProductForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    loading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form with all required fields', () => {
    render(<ProductForm {...defaultProps} />);

    // Check for required fields
    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/stock quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add product/i })).toBeInTheDocument();
  });

  it('should show validation errors for invalid inputs', async () => {
    render(<ProductForm {...defaultProps} />);

    // Try to submit empty form
    fireEvent.click(screen.getByRole('button', { name: /add product/i }));

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/product name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/price is required/i)).toBeInTheDocument();
      expect(screen.getByText(/category is required/i)).toBeInTheDocument();
      expect(screen.getByText(/stock quantity is required/i)).toBeInTheDocument();
    });
  });

  it('should prevent submission with invalid data', async () => {
    render(<ProductForm {...defaultProps} />);

    // Fill form with invalid data
    fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'a' } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '-1' } });
    fireEvent.change(screen.getByLabelText(/stock quantity/i), { target: { value: '-5' } });

    // Try to submit
    fireEvent.click(screen.getByRole('button', { name: /add product/i }));

    // Check that onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/price must be greater than 0/i)).toBeInTheDocument();
      expect(screen.getByText(/stock must be greater than 0/i)).toBeInTheDocument();
    });
  });

  it('should successfully add product with valid data', async () => {
    render(<ProductForm {...defaultProps} />);

    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'Test Product' } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '99.99' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: CATEGORIES[0] } });
    fireEvent.change(screen.getByLabelText(/stock quantity/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test description' } });
    fireEvent.change(screen.getByLabelText(/image url/i), { target: { value: 'https://example.com/image.jpg' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /add product/i }));

    // Check that onSubmit was called with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Product',
        price: 99.99,
        category: CATEGORIES[0],
        stock: 10,
        description: 'Test description',
        imageUrl: 'https://example.com/image.jpg',
      });
    });
  });

  it('should clear form after successful submission', async () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();
    render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    // Fill out the form
    await userEvent.type(screen.getByLabelText(/product name/i), 'Test Product');
    await userEvent.type(screen.getByLabelText(/price/i), '99.99');
    await userEvent.type(screen.getByLabelText(/stock quantity/i), '10');
    await userEvent.type(screen.getByLabelText(/description/i), 'Test description');
    
    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /add product/i }));
    
    // Wait for form to be cleared
    await waitFor(() => {
      expect(screen.getByLabelText(/product name/i)).toHaveValue('');
      expect(screen.getByLabelText(/price/i)).toHaveValue('');
      expect(screen.getByLabelText(/stock quantity/i)).toHaveValue('');
      expect(screen.getByLabelText(/description/i)).toHaveValue('');
    });
  });

  it('should handle edit mode correctly', () => {
    const editProduct = {
      id: '1',
      name: 'Existing Product',
      price: 49.99,
      category: CATEGORIES[0],
      stock: 5,
      description: 'Existing description',
      imageUrl: 'https://example.com/existing.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<ProductForm {...defaultProps} product={editProduct} />);

    // Check that form is populated with product data
    expect(screen.getByLabelText(/product name/i)).toHaveValue('Existing Product');
    expect(screen.getByLabelText(/price/i)).toHaveValue(49.99);
    expect(screen.getByLabelText(/stock quantity/i)).toHaveValue(5);
    expect(screen.getByLabelText(/description/i)).toHaveValue('Existing description');
    expect(screen.getByLabelText(/image url/i)).toHaveValue('https://example.com/existing.jpg');

    // Check that submit button shows "Update Product"
    expect(screen.getByRole('button', { name: /update product/i })).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    render(<ProductForm {...defaultProps} loading={true} />);

    // Check that submit button is disabled and shows loading state
    const submitButton = screen.getByRole('button', { name: /saving/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Saving...');
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<ProductForm {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });
}); 