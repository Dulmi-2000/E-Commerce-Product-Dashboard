export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
    description?: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductFormData {
    name: string;
    price: string;
    category: string;
    stock: string;
    description: string;
    imageUrl: string;
}

export interface ProductFilters {
    search: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    stockStatus: 'all' | 'in-stock' | 'out-of-stock' | 'low-stock';
}

export type ProductAction =
    | { type: 'SET_PRODUCTS'; payload: Product[] }
    | { type: 'ADD_PRODUCT'; payload: Product }
    | { type: 'UPDATE_PRODUCT'; payload: Product }
    | { type: 'DELETE_PRODUCT'; payload: string }
    | { type: 'DELETE_MULTIPLE'; payload: string[] }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };
