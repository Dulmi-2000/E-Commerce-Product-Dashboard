import { renderHook, act } from '@testing-library/react-hooks';
import { useProducts } from '../useProducts';
import type { Product } from '../../types/product';

// Mock localStorage
const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value;
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

describe('useProducts', () => {
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
        localStorageMock.clear();
        jest.clearAllMocks();
    });

    // Test Case 1: Should handle localStorage operations
    it('should handle localStorage operations', () => {
        const { result } = renderHook(() => useProducts());

        act(() => {
            result.current.addProduct(mockProduct);
        });

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'products',
            expect.any(String)
        );
    });

    // Test Case 2: Should add product successfully
    it('should add product successfully', () => {
        const { result } = renderHook(() => useProducts());

        act(() => {
            result.current.addProduct(mockProduct);
        });

        expect(result.current.products).toContainEqual(mockProduct);
    });

    // Test Case 3: Should update product successfully
    it('should update product successfully', () => {
        const { result } = renderHook(() => useProducts());
        const updatedProduct = { ...mockProduct, name: 'Updated Product' };

        act(() => {
            result.current.addProduct(mockProduct);
            result.current.updateProduct(updatedProduct);
        });

        expect(result.current.products).toContainEqual(updatedProduct);
        expect(result.current.products).not.toContainEqual(mockProduct);
    });

    // Test Case 4: Should delete product with confirmation
    it('should delete product with confirmation', () => {
        const { result } = renderHook(() => useProducts());
        const mockConfirm = jest.spyOn(window, 'confirm');
        mockConfirm.mockImplementation(() => true);

        act(() => {
            result.current.addProduct(mockProduct);
            result.current.deleteProduct(mockProduct.id);
        });

        expect(result.current.products).not.toContainEqual(mockProduct);
        expect(mockConfirm).toHaveBeenCalled();
    });

    // Test Case 5: Should maintain data integrity
    it('should maintain data integrity', () => {
        const { result } = renderHook(() => useProducts());
        const products = [mockProduct, { ...mockProduct, id: '2' }];

        act(() => {
            products.forEach(product => result.current.addProduct(product));
        });

        expect(result.current.products).toHaveLength(2);
        expect(result.current.products).toEqual(expect.arrayContaining(products));
    });

    // Test Case 6: Should handle errors gracefully
    it('should handle errors gracefully', () => {
        const { result } = renderHook(() => useProducts());
        const invalidProduct = { ...mockProduct, price: -1 };

        act(() => {
            result.current.addProduct(invalidProduct);
        });

        expect(result.current.products).not.toContainEqual(invalidProduct);
    });
}); 