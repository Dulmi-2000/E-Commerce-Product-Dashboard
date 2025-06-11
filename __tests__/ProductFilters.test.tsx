import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductFilters } from '../components/ProductFilters';
import { CATEGORIES, STOCK_STATUS_OPTIONS } from '../constants';

describe('ProductFilters', () => {
  const mockOnFiltersChange = vi.fn();
  const mockOnClearFilters = vi.fn();
  const defaultProps = {
    filters: {
      search: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      stockStatus: 'all',
    },
    onFiltersChange: mockOnFiltersChange,
    onClearFilters: mockOnClearFilters,
  };

  it('should render all filter inputs', () => {
    render(<ProductFilters {...defaultProps} />);

    // Check for search input
    expect(screen.getByPlaceholderText(/search products/i)).toBeInTheDocument();

    // Check for category select
    expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();

    // Check for price inputs
    expect(screen.getByPlaceholderText(/min price/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/max price/i)).toBeInTheDocument();

    // Check for stock status select
    expect(screen.getByRole('combobox', { name: /stock status/i })).toBeInTheDocument();

    // Check for clear filters button
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });

  it('should filter products by search term', () => {
    render(<ProductFilters {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultProps.filters,
      search: 'test',
    });
  });

  it('should filter products by category', () => {
    render(<ProductFilters {...defaultProps} />);

    const categorySelect = screen.getByRole('combobox', { name: /category/i });
    fireEvent.change(categorySelect, { target: { value: CATEGORIES[0] } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultProps.filters,
      category: CATEGORIES[0],
    });
  });

  it('should filter products by price range', () => {
    render(<ProductFilters {...defaultProps} />);

    const minPriceInput = screen.getByPlaceholderText(/min price/i);
    const maxPriceInput = screen.getByPlaceholderText(/max price/i);

    fireEvent.change(minPriceInput, { target: { value: '10' } });
    fireEvent.change(maxPriceInput, { target: { value: '100' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultProps.filters,
      minPrice: '10',
      maxPrice: '100',
    });
  });

  it('should filter products by stock status', () => {
    render(<ProductFilters {...defaultProps} />);

    const stockStatusSelect = screen.getByRole('combobox', { name: /stock status/i });
    fireEvent.change(stockStatusSelect, { target: { value: 'in-stock' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultProps.filters,
      stockStatus: 'in-stock',
    });
  });

  it('should combine multiple filters correctly', () => {
    render(<ProductFilters {...defaultProps} />);

    // Apply multiple filters
    fireEvent.change(screen.getByPlaceholderText(/search products/i), {
      target: { value: 'test' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: /category/i }), {
      target: { value: CATEGORIES[0] },
    });
    fireEvent.change(screen.getByPlaceholderText(/min price/i), {
      target: { value: '10' },
    });
    fireEvent.change(screen.getByPlaceholderText(/max price/i), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: /stock status/i }), {
      target: { value: 'in-stock' },
    });

    // Check that all filters are applied
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      search: 'test',
      category: CATEGORIES[0],
      minPrice: '10',
      maxPrice: '100',
      stockStatus: 'in-stock',
    });
  });

  it('should clear all filters when clear button is clicked', () => {
    render(<ProductFilters {...defaultProps} />);

    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    fireEvent.click(clearButton);

    expect(mockOnClearFilters).toHaveBeenCalled();
  });

  it('should show no results message when no products match filters', () => {
    render(<ProductFilters {...defaultProps} />);

    // Apply filters that would result in no matches
    fireEvent.change(screen.getByPlaceholderText(/search products/i), {
      target: { value: 'nonexistent' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: /category/i }), {
      target: { value: CATEGORIES[0] },
    });

    // Check that the appropriate message is shown
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  it('should handle invalid price inputs', () => {
    render(<ProductFilters {...defaultProps} />);

    const minPriceInput = screen.getByPlaceholderText(/min price/i);
    const maxPriceInput = screen.getByPlaceholderText(/max price/i);

    // Test negative values
    fireEvent.change(minPriceInput, { target: { value: '-10' } });
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultProps.filters,
      minPrice: '',
    });

    // Test non-numeric values
    fireEvent.change(maxPriceInput, { target: { value: 'abc' } });
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultProps.filters,
      maxPrice: '',
    });
  });
}); 