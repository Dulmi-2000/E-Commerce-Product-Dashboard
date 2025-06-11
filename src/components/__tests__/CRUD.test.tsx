import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
import { useProducts } from '../../hooks/useProducts';
import { CATEGORIES } from '../../constants';

// Mock the useProducts hook
vi.mock('../hooks/useProducts', () => ({
  useProducts: vi.fn(),
}));

describe('CRUD Operations', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Test Product 1',
      price: 99.99,
      category: CATEGORIES[0],
      stock: 10,
      description: 'Test description 1',
      imageUrl: 'https://example.com/image1.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Test Product 2',
      price: 149.99,
      category: CATEGORIES[1],
      stock: 0,
      description: 'Test description 2',
      imageUrl: 'https://example.com/image2.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockUseProducts = {
    products: mockProducts,
    loading: false,
    error: null,
    addProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
    deleteMultipleProducts: vi.fn(),
    undoDelete: vi.fn(),
    canUndo: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useProducts as any).mockReturnValue(mockUseProducts);
  });

  it('should delete product with confirmation', async () => {
    render(<Dashboard />);

    // Find and click delete button for first product
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    // Check if confirmation dialog appears
    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(confirmButton);

    // Check if deleteProduct was called with correct id
    expect(mockUseProducts.deleteProduct).toHaveBeenCalledWith('1');
  });

  it('should update product successfully', async () => {
    render(<Dashboard />);

    // Find and click edit button for first product
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    // Check if form is populated with product data
    expect(screen.getByLabelText(/product name/i)).toHaveValue('Test Product 1');
    expect(screen.getByLabelText(/price/i)).toHaveValue('99.99');

    // Update product data
    fireEvent.change(screen.getByLabelText(/product name/i), {
      target: { value: 'Updated Product' },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: '129.99' },
    });

    // Submit form
    const updateButton = screen.getByRole('button', { name: /update product/i });
    fireEvent.click(updateButton);

    // Check if updateProduct was called with correct data
    expect(mockUseProducts.updateProduct).toHaveBeenCalledWith('1', {
      name: 'Updated Product',
      price: 129.99,
      category: CATEGORIES[0],
      stock: 10,
      description: 'Test description 1',
      imageUrl: 'https://example.com/image1.jpg',
    });
  });

  it('should handle localStorage operations', async () => {
    // Mock localStorage
    const mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    render(<Dashboard />);

    // Add a new product
    const addButton = screen.getByRole('button', { name: /add product/i });
    fireEvent.click(addButton);

    // Fill form
    fireEvent.change(screen.getByLabelText(/product name/i), {
      target: { value: 'New Product' },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: '199.99' },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: CATEGORIES[0] },
    });
    fireEvent.change(screen.getByLabelText(/stock quantity/i), {
      target: { value: '20' },
    });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /add product/i });
    fireEvent.click(submitButton);

    // Check if localStorage was updated
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('should maintain data integrity', async () => {
    render(<Dashboard />);

    // Add a new product
    const addButton = screen.getByRole('button', { name: /add product/i });
    fireEvent.click(addButton);

    // Fill form with invalid data
    fireEvent.change(screen.getByLabelText(/product name/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: '-1' },
    });

    // Try to submit
    const submitButton = screen.getByRole('button', { name: /add product/i });
    fireEvent.click(submitButton);

    // Check that addProduct was not called
    expect(mockUseProducts.addProduct).not.toHaveBeenCalled();

    // Check for validation errors
    expect(screen.getByText(/product name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/price must be at least/i)).toBeInTheDocument();
  });

  it('should handle bulk delete operations', async () => {
    render(<Dashboard />);

    // Select products
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    // Click bulk delete button
    const bulkDeleteButton = screen.getByRole('button', { name: /delete selected/i });
    fireEvent.click(bulkDeleteButton);

    // Check if confirmation dialog appears
    expect(screen.getByText(/are you sure you want to delete 2 products/i)).toBeInTheDocument();

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /delete all/i });
    fireEvent.click(confirmButton);

    // Check if deleteMultipleProducts was called with correct ids
    expect(mockUseProducts.deleteMultipleProducts).toHaveBeenCalledWith(['1', '2']);
  });

  it('should handle undo delete operation', async () => {
    // Mock canUndo to be true
    (useProducts as any).mockReturnValue({
      ...mockUseProducts,
      canUndo: true,
    });

    render(<Dashboard />);

    // Click undo button
    const undoButton = screen.getByRole('button', { name: /undo/i });
    fireEvent.click(undoButton);

    // Check if undoDelete was called
    expect(mockUseProducts.undoDelete).toHaveBeenCalled();
  });
}); 