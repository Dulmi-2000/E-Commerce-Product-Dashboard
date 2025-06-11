import type { Product, ProductFilters } from '../types/product';
import { LOW_STOCK_THRESHOLD } from '../constants';

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
    return products.filter(product => {
        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const nameMatch = product.name.toLowerCase().includes(searchTerm);
            const descriptionMatch = product.description?.toLowerCase().includes(searchTerm) || false;
            if (!nameMatch && !descriptionMatch) return false;
        }

        // Category filter
        if (filters.category && filters.category !== 'all') {
            if (product.category !== filters.category) return false;
        }

        // Price range filter
        if (filters.minPrice) {
            const minPrice = parseFloat(filters.minPrice);
            if (!isNaN(minPrice) && product.price < minPrice) return false;
        }

        if (filters.maxPrice) {
            const maxPrice = parseFloat(filters.maxPrice);
            if (!isNaN(maxPrice) && product.price > maxPrice) return false;
        }

        // Stock status filter
        if (filters.stockStatus !== 'all') {
            switch (filters.stockStatus) {
                case 'in-stock':
                    if (product.stock <= 0) return false;
                    break;
                case 'out-of-stock':
                    if (product.stock > 0) return false;
                    break;
                case 'low-stock':
                    if (product.stock >= LOW_STOCK_THRESHOLD) return false;
                    break;
            }
        }

        return true;
    });
}

export function getActiveFilterCount(filters: ProductFilters): number {
    let count = 0;
    if (filters.search) count++;
    if (filters.category && filters.category !== 'all') count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.stockStatus !== 'all') count++;
    return count;
}
