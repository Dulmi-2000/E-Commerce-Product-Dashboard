import React from "react";
import { Package, Plus } from "lucide-react";
import { Button } from "./ui/button";
import logo from "../assets/shoppie-logo.png";

interface HeaderProps {
  productCount: number;
  onAddProduct: () => void;
  canUndo: boolean;
  onUndo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  productCount,
  onAddProduct,
  canUndo,
  onUndo,
}) => {
  return (
    <header className="bg-teal-600 shadow-sm border-b border-teal-700 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Shoppie Logo" className="h-12 w-12 rounded-full shadow-md object-cover bg-white" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Shoppie</h1>
              <p className="text-sm text-teal-100">
                {productCount} {productCount === 1 ? "product" : "products"} total
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {canUndo && (
              <Button
                onClick={onUndo}
                className="hidden sm:flex px-4 py-2 text-sm font-medium rounded-md transition border-teal-400 border-1 bg-teal-600 hover:bg-teal-500"
              >
                <span className="font-semibold"> Undo Delete</span>
              </Button>
            )}
            <Button
              onClick={onAddProduct}
              className="flex items-center space-x-1 px-4 py-2 text-sm font-medium rounded-md transition bg-teal-500 border-1 border-teal-400 hover:bg-teal-600"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline font-semibold">
                Add Product
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
