import { useState, useCallback } from "react";
import { useDebounce } from "./useDebounce";
import type { PriceRange, StockFilter, CategoryFilter } from "../types/product";

export const useProductFilters = () => {
  const [searchTerm, setSearchTermState] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: "",
    max: "",
  });
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");

  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTermState("");
    setCategoryFilter("all");
    setPriceRange({ min: "", max: "" });
    setStockFilter("all");
  }, []);

  return {
    searchTerm: debouncedSearchTerm,
    categoryFilter,
    priceRange,
    stockFilter,
    setSearchTerm,
    setCategoryFilter,
    setPriceRange,
    setStockFilter,
    clearFilters,
  };
};
