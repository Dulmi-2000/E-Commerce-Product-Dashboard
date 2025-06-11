import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ProductGrid } from '../components/ProductGrid';
import { CATEGORIES } from '../constants';

describe('ProductGrid', () => {
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

  const defaultProps = {
    products: mockProducts,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    selectedProducts: [],
    onSelectionChange: vi.fn(),
    showSelection: false,
  };

  it('should render products correctly', () => {
    render(<ProductGrid {...defaultProps} />);

    // Check if all products are rendered
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('$149.99')).toBeInTheDocument();
  });

  it('should handle empty state', () => {
    render(<ProductGrid {...defaultProps} products={[]} />);
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  it('should display product information accurately', () => {
    render(<ProductGrid products={mockProducts} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />);
    
    // Find the product card by its title
    const productCard = screen.getByText('Test Product 1').closest('div[class*="Card"]') as HTMLElement;
    expect(productCard).not.toBeNull();
    
    // Use within to scope queries to the card
    const card = within(productCard);
    expect(card.getByText('Test description 1')).toBeInTheDocument();
    expect(card.getByText('10 units')).toBeInTheDocument();
    expect(card.getByText(CATEGORIES[0])).toBeInTheDocument();
  });

  it('should handle image loading errors', () => {
    render(<ProductGrid {...defaultProps} />);

    // Simulate image error
    const images = screen.getAllByRole('img');
    fireEvent.error(images[0]);

    // Check if fallback image is used
    expect(images[0]).toHaveAttribute('src', expect.stringContaining('placeholder'));
  });

  it('should handle product selection', () => {
    render(<ProductGrid {...defaultProps} showSelection={true} />);

    // Find and click checkbox
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    // Check if selection callback was called
    expect(defaultProps.onSelectionChange).toHaveBeenCalledWith('1', true);
  });

  it('should handle edit action', () => {
    render(<ProductGrid {...defaultProps} />);

    // Find and click edit button
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    // Check if edit callback was called with correct product
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('should handle delete action', () => {
    render(<ProductGrid {...defaultProps} />);

    // Find and click delete button
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    // Check if delete callback was called with correct product id
    expect(defaultProps.onDelete).toHaveBeenCalledWith('1');
  });

  it('should show loading state', () => {
    render(<ProductGrid products={[]} isLoading={true} onEdit={vi.fn()} onDelete={vi.fn()} />);
    const skeletons = screen.getAllByTestId('product-skeleton');
    expect(skeletons).toHaveLength(8); // Assuming 8 skeleton items are shown during loading
  });

  it('should display stock status badges correctly', () => {
    render(<ProductGrid {...defaultProps} />);

    // Check in-stock badge
    expect(screen.getByText('In Stock')).toBeInTheDocument();
    
    // Check out-of-stock badge
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });
}); 