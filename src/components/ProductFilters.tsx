import React, { useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { ProductFilters as IProductFilters } from "../types/product";
import { CATEGORIES, STOCK_STATUS_OPTIONS } from "../constants";
import { getActiveFilterCount } from "../utils/filters";

interface ProductFiltersProps {
  filters: IProductFilters;
  onFiltersChange: (filters: IProductFilters) => void;
  onClearFilters: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const activeFilterCount = useMemo(
    () => getActiveFilterCount(filters),
    [filters]
  );

  const handleInputChange = (field: keyof IProductFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200 mb-8 relative">
      <style>{`
        @media (min-width: 1100px) {
          .filters-1100-row {
            display: flex;
            flex-direction: row;
            gap: 1rem;
            width: 100%;
          }
          .filters-1100-row > * {
            flex: 1 1 0;
            min-width: 120px;
          }
        }
      `}</style>
      <div className="w-full flex flex-col gap-4">
        {/* Search Bar Row */}
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by name or description..."
              value={filters.search}
              onChange={(e) => handleInputChange("search", e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
        {/* Responsive Filters */}
        <div className={`hidden md:grid gap-4 w-full ${activeFilterCount > 0 ? 'grid-cols-5' : 'grid-cols-4'} filters-1100-row`}>
          <div className="min-w-[120px]">
            <Select
              value={filters.category || "all"}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger className="bg-white border border-gray-200 rounded-md px-4 py-2 w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[120px]">
            <Input
              placeholder="Min Price"
              type="number"
              min="0"
              step="0.01"
              value={filters.minPrice}
              onChange={(e) => handleInputChange("minPrice", e.target.value)}
              className="bg-white border border-gray-200 rounded-md px-4 py-2 w-full"
            />
          </div>
          <div className="min-w-[120px]">
            <Input
              placeholder="Max Price"
              type="number"
              min="0"
              step="0.01"
              value={filters.maxPrice}
              onChange={(e) => handleInputChange("maxPrice", e.target.value)}
              className="bg-white border border-gray-200 rounded-md px-4 py-2 w-full"
            />
          </div>
          <div className="min-w-[120px]">
            <Select
              value={filters.stockStatus}
              onValueChange={(value) => handleInputChange("stockStatus", value)}
            >
              <SelectTrigger className="bg-white border border-gray-200 rounded-md px-4 py-2 w-full">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                {STOCK_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {activeFilterCount > 0 && (
            <div className="min-w-[120px] flex flex-col items-center justify-center">
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="flex items-center space-x-2 whitespace-nowrap bg-teal-100 border-1 border-teal-200 w-full justify-center"
                style={{
                  color: "#374151",
                  transition: "background-color 0.2s ease",
                }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = "#e4efff")}
              >
                <X className="h-4 w-4" />
                <span className="font-semibold">Clear ({activeFilterCount})</span>
              </Button>
              <span className="mt-2 text-xs text-gray-500 font-medium whitespace-nowrap text-center">
                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
              </span>
            </div>
          )}
        </div>
        {/* 2x2 grid for <864px, single column for <640px */}
        <div className="grid grid-cols-1 gap-4 w-full md:hidden">
          {/* Mobile: single column */}
          <div className="sm:hidden flex flex-col gap-4 w-full">
            <Select
              value={filters.category || "all"}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger className="bg-white border border-gray-200 rounded-md px-4 py-2 w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Min Price"
              type="number"
              min="0"
              step="0.01"
              value={filters.minPrice}
              onChange={(e) => handleInputChange("minPrice", e.target.value)}
              className="bg-white border border-gray-200 rounded-md px-4 py-2 w-full"
            />
            <Input
              placeholder="Max Price"
              type="number"
              min="0"
              step="0.01"
              value={filters.maxPrice}
              onChange={(e) => handleInputChange("maxPrice", e.target.value)}
              className="bg-white border border-gray-200 rounded-md px-4 py-2 w-full"
            />
            <Select
              value={filters.stockStatus}
              onValueChange={(value) => handleInputChange("stockStatus", value)}
            >
              <SelectTrigger className="bg-white border border-gray-200 rounded-md px-4 py-2 w-full">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                {STOCK_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Tablet: 2x2 grid for >=640px and <864px */}
          <div className="hidden sm:grid grid-cols-2 gap-4 w-full">
            <div>
              <Select
                value={filters.category || "all"}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger className="bg-white border border-gray-200 rounded-md px-4 py-2 w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                placeholder="Min Price"
                type="number"
                min="0"
                step="0.01"
                value={filters.minPrice}
                onChange={(e) => handleInputChange("minPrice", e.target.value)}
                className="bg-white border border-gray-200 rounded-md px-4 py-2 w-full"
              />
            </div>
            <div>
              <Input
                placeholder="Max Price"
                type="number"
                min="0"
                step="0.01"
                value={filters.maxPrice}
                onChange={(e) => handleInputChange("maxPrice", e.target.value)}
                className="bg-white border border-gray-200 rounded-md px-4 py-2 w-full"
              />
            </div>
            <div>
              <Select
                value={filters.stockStatus}
                onValueChange={(value) => handleInputChange("stockStatus", value)}
              >
                <SelectTrigger className="bg-white border border-gray-200 rounded-md px-4 py-2 w-full">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  {STOCK_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {/* Clear Filters and Active Filter Count for small screens */}
        {activeFilterCount > 0 && (
          <div className="flex flex-col items-center justify-center mt-2 md:hidden">
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex items-center space-x-2 whitespace-nowrap bg-teal-100 border-1 border-teal-200 w-full justify-center"
              style={{
                color: "#374151",
                transition: "background-color 0.2s ease",
              }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = "#e4efff")}
            >
              <X className="h-4 w-4" />
              <span className="font-semibold">Clear ({activeFilterCount})</span>
            </Button>
            <span className="mt-2 text-xs text-gray-500 font-medium whitespace-nowrap text-center">
              {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
