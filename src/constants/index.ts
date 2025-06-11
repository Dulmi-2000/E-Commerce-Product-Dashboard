export const CATEGORIES = [
    'Electronics',
    'Clothing',
    'Books',
    'Home',
    'Sports',
    'Other'
] as const;

export const STOCK_STATUS_OPTIONS = [
    { value: 'all', label: 'All Products' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
    { value: 'low-stock', label: 'Low Stock (<5)' }
] as const;

export const VALIDATION_RULES = {
    name: {
        minLength: 3,
        maxLength: 50
    },
    description: {
        maxLength: 200
    },
    price: {
        min: 0.01,
        max: 999999.99
    },
    stock: {
        min: 0,
        max: 999999
    }
} as const;

export const DEBOUNCE_DELAY = 300;
export const LOW_STOCK_THRESHOLD = 5;
