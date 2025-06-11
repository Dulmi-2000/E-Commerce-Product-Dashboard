import { useReducer, useEffect, useCallback } from "react";
import type { Product, ProductAction } from "../types/product";
import { useLocalStorage } from "./useLocalStorage";

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  recentlyDeleted: Product[];
}

function productReducer(
  state: ProductState,
  action: ProductAction
): ProductState {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload, loading: false };
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [action.payload, ...state.products],
        error: null,
      };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
        error: null,
      };
    case "DELETE_PRODUCT": {
      const productToDelete = state.products.find(
        (p) => p.id === action.payload
      );
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
        recentlyDeleted: productToDelete
          ? [productToDelete, ...state.recentlyDeleted.slice(0, 4)]
          : state.recentlyDeleted,
        error: null,
      };
    }
    case "DELETE_MULTIPLE": {
      const productsToDelete = state.products.filter((p) =>
        action.payload.includes(p.id)
      );
      return {
        ...state,
        products: state.products.filter((p) => !action.payload.includes(p.id)),
        recentlyDeleted: [...productsToDelete, ...state.recentlyDeleted].slice(
          0,
          5
        ),
        error: null,
      };
    }
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function useProducts() {
  const [storedProducts, setStoredProducts] = useLocalStorage<Product[]>(
    "ecommerce-products",
    []
  );

  const [state, dispatch] = useReducer(productReducer, {
    products: storedProducts,
    loading: false,
    error: null,
    recentlyDeleted: [],
  });

  useEffect(() => {
    setStoredProducts(state.products);
  }, [state.products, setStoredProducts]);

  const addProduct = useCallback(
    (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
      const newProduct: Product = {
        ...productData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      dispatch({ type: "ADD_PRODUCT", payload: newProduct });
    },
    []
  );

  const updateProduct = useCallback(
    (id: string, productData: Partial<Product>) => {
      const existingProduct = state.products.find((p) => p.id === id);
      if (existingProduct) {
        const updatedProduct: Product = {
          ...existingProduct,
          ...productData,
          updatedAt: new Date(),
        };
        dispatch({ type: "UPDATE_PRODUCT", payload: updatedProduct });
      }
    },
    [state.products]
  );

  const deleteProduct = useCallback((id: string) => {
    dispatch({ type: "DELETE_PRODUCT", payload: id });
  }, []);

  const deleteMultipleProducts = useCallback((ids: string[]) => {
    dispatch({ type: "DELETE_MULTIPLE", payload: ids });
  }, []);

  const undoDelete = useCallback(() => {
    const lastDeleted = state.recentlyDeleted[0];
    if (lastDeleted) {
      dispatch({ type: "ADD_PRODUCT", payload: lastDeleted });
    }
  }, [state.recentlyDeleted]);

  return {
    ...state,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteMultipleProducts,
    undoDelete,
    canUndo: state.recentlyDeleted.length > 0,
  };
}
