import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductFilters } from '../ProductFilters';

describe('ProductFilters', () => {
  const mockOnFiltersChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Case 1: Should filter products by search term
  it('should filter products by search term', async () => {
    render(<ProductFilters onFiltersChange={mockOnFiltersChange} />);
    
    const searchInput = screen.getByPlaceholderText(/search products/i);
    await userEvent.type(searchInput, 'test product');

    expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
      searchTerm: 'test product'
    }));
  });

  // Test Case 2: Should filter products by category
  it('should filter products by category', async () => {
    render(<ProductFilters onFiltersChange={mockOnFiltersChange} />);
    
    const categorySelect = screen.getByLabelText(/category/i);
    await userEvent.selectOptions(categorySelect, 'Electronics');

    expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
      category: 'Electronics'
    }));
  });

  // Test Case 3: Should filter products by price range
  it('should filter products by price range', async () => {
    render(<ProductFilters onFiltersChange={mockOnFiltersChange} />);
    
    const minPriceInput = screen.getByLabelText(/min price/i);
    const maxPriceInput = screen.getByLabelText(/max price/i);

    await userEvent.type(minPriceInput, '10');
    await userEvent.type(maxPriceInput, '100');

    expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
      minPrice: 10,
      maxPrice: 100
    }));
  });

  // Test Case 4: Should filter products by stock status
  it('should filter products by stock status', async () => {
    render(<ProductFilters onFiltersChange={mockOnFiltersChange} />);
    
    const stockStatusSelect = screen.getByLabelText(/stock status/i);
    await userEvent.selectOptions(stockStatusSelect, 'in-stock');

    expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
      stockStatus: 'in-stock'
    }));
  });

  // Test Case 5: Should combine multiple filters correctly
  it('should combine multiple filters correctly', async () => {
    render(<ProductFilters onFiltersChange={mockOnFiltersChange} />);
    
    const searchInput = screen.getByPlaceholderText(/search products/i);
    const categorySelect = screen.getByLabelText(/category/i);
    const minPriceInput = screen.getByLabelText(/min price/i);
    const stockStatusSelect = screen.getByLabelText(/stock status/i);

    await userEvent.type(searchInput, 'test');
    await userEvent.selectOptions(categorySelect, 'Electronics');
    await userEvent.type(minPriceInput, '50');
    await userEvent.selectOptions(stockStatusSelect, 'in-stock');

    expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
      searchTerm: 'test',
      category: 'Electronics',
      minPrice: 50,
      stockStatus: 'in-stock'
    }));
  });

  // Test Case 6: Should show no results message appropriately
  it('should show no results message appropriately', () => {
    render(<ProductFilters onFiltersChange={mockOnFiltersChange} noResults={true} />);
    
    expect(screen.getByText(/no products match your filters/i)).toBeInTheDocument();
  });
}); 