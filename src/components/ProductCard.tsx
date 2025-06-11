import React, { memo, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import type { Product } from "../types/product";
import { formatPrice, truncateText } from "../utils/validation";
import { LOW_STOCK_THRESHOLD } from "../constants";
import { cn } from "../lib/utils";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelectionChange?: (id: string, selected: boolean) => void;
  showSelection?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = memo(
  ({
    product,
    onEdit,
    onDelete,
    isSelected = false,
    onSelectionChange,
    showSelection = false,
  }) => {
    const [imageError, setImageError] = useState(false);

    const getStockStatus = () => {
      if (product.stock === 0)
        return { label: "Out of Stock", variant: "destructive" as const };
      if (product.stock < LOW_STOCK_THRESHOLD)
        return { label: "Low Stock", variant: "secondary" as const };
      return { label: "In Stock", variant: "default" as const };
    };

    const stockStatus = getStockStatus();
    const fallbackImage =
      "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";

    return (
      <Card className={"group hover:shadow-lg transition-all duration-200 relative bg-white cursor-pointer"}>
        {showSelection && (
          <div className="absolute top-4 left-4 z-10 flex items-center">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked: boolean) =>
                onSelectionChange?.(product.id, checked as boolean)
              }
              className="bg-white shadow-sm h-4 w-4"
            />
          </div>
        )}

        <CardHeader className="p-0">
          <div className="aspect-square overflow-hidden rounded-t-lg bg-muted border-b border-gray-100">
            <img
              src={
                imageError ? fallbackImage : product.imageUrl || fallbackImage
              }
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
              width={300}
              height={200}
            />
          </div>
          <Badge
            variant={stockStatus.variant}
            className={cn(
              "absolute top-3 right-3 z-10 px-3",
              stockStatus.variant === "destructive" &&
                "bg-red-100 text-red-700 border-1 border-red-300 hover:bg-red-200",
              stockStatus.variant === "secondary" &&
                "bg-yellow-100 text-yellow-600 border-1 border-yellow-300 hover:bg-yellow-200",
              stockStatus.variant === "default" && "bg-green-100 text-green-800 border-1 border-green-300 hover:bg-green-200"
            )}
          >
            {stockStatus.label}
          </Badge>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg leading-tight text-black">
              {truncateText(product.name, 30)}
            </h3>
            <span className="px-2 rounded-xl border-1 border-outline text-[12px] font-semibold text-gray-600 px-2 bg-gray-50">
              {product.category}
            </span>
          </div>

          <p className="text-2xl font-bold text-gray-800 mb-2">
            {formatPrice(product.price)}
          </p>

          {product.description && (
            <p className="text-sm text-gray-500 leading-relaxed break-words overflow-hidden text-ellipsis">
              {truncateText(product.description, 80)}
            </p>
          )}

          <div className="flex justify-between text-sm text-black mt-4">
            <span className="text-gray-700">
              Stock:{" "}
              <span className="font-semibold text-gray-500">
                {product.stock} units
              </span>
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            variant="outlinenew"
            size="sm"
            onClick={() => onEdit(product)}
            className="flex-1 border-gray-300 text-gray-600 bg-white  flex items-center justify-center font-semibold"
          >
            <Edit className="h-4 w-4 mr-1 text-gray-600" />
            Edit
          </Button>
          <Button
            variant="outlinenew"
            size="sm"
            onClick={() => onDelete(product.id)}
            className="flex-1 border-gray-300 text-red-600 bg-white  flex items-center justify-center font-semibold"
          >
            <Trash2 className="h-4 w-4 mr-1 text-red-600" />
            Delete
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

ProductCard.displayName = "ProductCard";