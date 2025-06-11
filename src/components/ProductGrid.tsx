import React, { memo } from "react";
import type { Product } from "../types/product";
import { ProductCard } from "./ProductCard";
import ProductSkeleton from "./ProductSkelton";

interface ProductGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  selectedProducts?: string[];
  onSelectionChange?: (id: string, selected: boolean) => void;
  showSelection?: boolean;
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = memo(
  ({
    products,
    onEdit,
    onDelete,
    selectedProducts = [],
    onSelectionChange,
    showSelection = false,
    isLoading = false,
  }) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-teal-500 "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No products found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or add some products to get started.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
            isSelected={selectedProducts.includes(product.id)}
            onSelectionChange={onSelectionChange}
            showSelection={showSelection}
          />
        ))}
      </div>
    );
  }
);

ProductGrid.displayName = "ProductGrid";
