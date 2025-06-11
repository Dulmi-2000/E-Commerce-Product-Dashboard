import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { Product, ProductFormData } from "../types/product";
import {
  validateProductForm,
  type ValidationErrors,
} from "../utils/validation";
import { CATEGORIES, VALIDATION_RULES } from "../constants";

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (product) {
      console.log('Product data in form:', product); 
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        description: product.description || "",
        imageUrl: product.imageUrl || "",
      });
    } else {
      setFormData({
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
        imageUrl: "",
      });
    }
  }, [product]);

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    console.log('Input change:', field, value); 
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (touched[field]) {
      const newErrors = validateProductForm({ ...formData, [field]: value });
      setErrors(newErrors);
    }
  };

  const handleBlur = (field: keyof ProductFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateProductForm(formData);
    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateProductForm(formData);
    setErrors(validationErrors);
    setTouched({
      name: true,
      price: true,
      category: true,
      stock: true,
      description: true,
      imageUrl: true,
    });

    if (Object.keys(validationErrors).length === 0) {
      onSubmit({
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        description: formData.description.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
      });
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      price: "",
      category: "",
      stock: "",
      description: "",
      imageUrl: "",
    });
    setErrors({});
    setTouched({});
  };

  const isFormValid =
    Object.keys(errors).length === 0 &&
    formData.name &&
    formData.price &&
    formData.category &&
    formData.stock;

  const remainingChars =
    VALIDATION_RULES.description.maxLength - formData.description.length;

  return (
    <div className="bg-white rounded-xl shadow-xl p-5 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{product ? "Edit Product" : "Add New Product"}</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="Enter product name"
            className={errors.name && touched.name ? "border-destructive" : ""}
          />
          {errors.name && touched.name && (
            <p className="text-sm text-destructive mt-1">{errors.name}</p>
          )}
        </div>
        {/* Price and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price <span className="text-red-500">*</span></Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              onBlur={() => handleBlur("price")}
              placeholder="0.00"
              className={errors.price && touched.price ? "border-destructive" : ""}
            />
            {errors.price && touched.price && (
              <p className="text-sm text-destructive mt-1">{errors.price}</p>
            )}
          </div>
          <div>
            <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
            <Select
              value={formData.category}
              onValueChange={(value) => {
                console.log('Category changed:', value); 
                handleInputChange("category", value);
              }}
            >
              <SelectTrigger
                id="category"
                className={errors.category && touched.category ? "border-destructive" : ""}
              >
                <SelectValue>
                  {formData.category || "Select category"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && touched.category && (
              <p className="text-sm text-destructive mt-1">{errors.category}</p>
            )}
          </div>
        </div>
        {/* Stock Quantity */}
        <div>
          <Label htmlFor="stock">Stock Quantity <span className="text-red-500">*</span></Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => handleInputChange("stock", e.target.value)}
            onBlur={() => handleBlur("stock")}
            placeholder="0"
            className={errors.stock && touched.stock ? "border-destructive" : ""}
          />
          {errors.stock && touched.stock && (
            <p className="text-sm text-destructive mt-1">{errors.stock}</p>
          )}
        </div>
        {/* Image URL */}
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={(e) => handleInputChange("imageUrl", e.target.value)}
            onBlur={() => handleBlur("imageUrl")}
            placeholder="https://example.com/image.jpg"
            className={errors.imageUrl && touched.imageUrl ? "border-destructive" : ""}
          />
          {errors.imageUrl && touched.imageUrl && (
            <p className="text-sm text-destructive mt-1">{errors.imageUrl}</p>
          )}
        </div>
        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            placeholder="Enter product description"
            rows={3}
            className={errors.description && touched.description ? "border-destructive" : ""}
          />
          <div className="flex justify-between mt-1">
            {errors.description && touched.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
            <p
              className={`text-sm ml-auto ${
                remainingChars < 20
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {remainingChars} characters remaining
            </p>
          </div>
        </div>
        {/* Form Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="font-semibold text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid || loading}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold transition-colors duration-200 hover:shadow-md"
          >
            {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </form>
    </div>
  );
};