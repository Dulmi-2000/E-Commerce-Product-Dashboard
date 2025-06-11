import React, { useState, useMemo, useCallback } from "react";
import { Header } from "./Header";
import { ProductFilters } from "./ProductFilters";
import { ProductGrid } from "./ProductGrid";
import { ProductForm } from "./ProductForm";
import { ConfirmDialog } from "./ConfirmDialog";
import { BulkActions } from "./BulkActions";
import { useProducts } from "../hooks/useProducts";
import { useDebounce } from "../hooks/useDebounce";
import { useToast } from "../hooks/use-toast";
import type {
  Product,
  ProductFilters as IProductFilters,
} from "../types/product";
import { filterProducts } from "../utils/filters";
import { DEBOUNCE_DELAY } from "../constants";
import { Dialog, DialogContent } from "./ui/dialog";

export const Dashboard: React.FC = () => {
  const {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteMultipleProducts,
    undoDelete,
    canUndo,
  } = useProducts();

  const { toast } = useToast();

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Filters
  const [filters, setFilters] = useState<IProductFilters>({
    search: "",
    category: "all",
    minPrice: "",
    maxPrice: "",
    stockStatus: "all",
  });

  const debouncedFilters = useDebounce(filters, DEBOUNCE_DELAY);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return filterProducts(products, debouncedFilters);
  }, [products, debouncedFilters]);

  // Handlers
  const handleAddProduct = useCallback(() => {
    setEditingProduct(null);
    setShowForm(true);
  }, []);

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
      try {
        if (editingProduct) {
          updateProduct(editingProduct.id, productData);
          toast({
            title: "Product Updated",
            description: `${productData.name} has been updated successfully.`,
            className: "bg-green-50 border-green-200 text-green-800",
          });
        } else {
          addProduct(productData);
          toast({
            title: "Product Added",
            description: `${productData.name} has been added to your catalog.`,
            className: "bg-green-50 border-green-200 text-green-800",
          });
        }
        setShowForm(false);
        setEditingProduct(null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save product. Please try again.",
          variant: "destructive",
          className: "bg-red-50 border-red-200 text-red-800",
        });
      }
    },
    [editingProduct, updateProduct, addProduct, toast]
  );

  const handleDeleteProduct = useCallback(
    (id: string) => {
      const product = products.find((p) => p.id === id);
      if (product) {
        setDeleteConfirm({ id, name: product.name });
      }
    },
    [products]
  );

  const confirmDelete = useCallback(() => {
    if (deleteConfirm) {
      deleteProduct(deleteConfirm.id);
      toast({
        title: "Product Deleted",
        description: `${deleteConfirm.name} has been removed from your catalog.`,
        className: "bg-green-50 border-green-200 text-green-800",
      });
      setDeleteConfirm(null);
    }
  }, [deleteConfirm, deleteProduct, toast]);

  const handleSelectionChange = useCallback((id: string, selected: boolean) => {
    setSelectedProducts((prev) =>
      selected ? [...prev, id] : prev.filter((productId) => productId !== id)
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedProducts(filteredProducts.map((p) => p.id));
  }, [filteredProducts]);

  const handleDeselectAll = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  const handleBulkDelete = useCallback(() => {
    setBulkDeleteConfirm(true);
  }, []);

  const confirmBulkDelete = useCallback(() => {
    deleteMultipleProducts(selectedProducts);
    toast({
      title: "Products Deleted",
      description: `${selectedProducts.length} products have been removed.`,
      className: "bg-green-50 border-green-200 text-green-800",
    });
    setSelectedProducts([]);
    setBulkDeleteConfirm(false);
  }, [selectedProducts, deleteMultipleProducts, toast]);

  const handleUndo = useCallback(() => {
    undoDelete();
    toast({
      title: "Action Undone",
      description: "Product has been restored.",
      className: "bg-green-50 border-green-200 text-green-800",
    });
  }, [undoDelete, toast]);

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      category: "all",
      minPrice: "",
      maxPrice: "",
      stockStatus: "all",
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Header
        productCount={products.length}
        onAddProduct={handleAddProduct}
        canUndo={canUndo}
        onUndo={handleUndo}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
        />

        <BulkActions
          selectedCount={selectedProducts.length}
          totalCount={filteredProducts.length}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onDeleteSelected={handleBulkDelete}
          allSelected={
            selectedProducts.length === filteredProducts.length &&
            filteredProducts.length > 0
          }
        />

        {loading && products.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4 text-xl">
              Loading products...
            </p>
          </div>
        ) : (
          <ProductGrid
            products={filteredProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            selectedProducts={selectedProducts}
            onSelectionChange={handleSelectionChange}
            showSelection={
              selectedProducts.length > 0 || filteredProducts.length > 1
            }
          />
        )}
      </main>

      {/* Add/Edit Product Dialog */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingProduct(null);
        }}
      >
        <DialogContent>
          <ProductForm
            product={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
            loading={loading}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        destructive
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        open={bulkDeleteConfirm}
        onOpenChange={setBulkDeleteConfirm}
        title="Delete Products"
        description={`Are you sure you want to delete ${selectedProducts.length} products? This action cannot be undone.`}
        confirmText="Delete All"
        onConfirm={confirmBulkDelete}
        destructive
      />
    </div>
  );
};
