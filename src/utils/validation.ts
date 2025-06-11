import { VALIDATION_RULES } from "../constants";

export interface ValidationErrors {
  name?: string;
  price?: string;
  category?: string;
  stock?: string;
  description?: string;
  imageUrl?: string;
}

export function validateProductForm(data: {
  name: string;
  price: string;
  category: string;
  stock: string;
  description: string;
  imageUrl: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  // Name validation
  if (!data.name.trim()) {
    errors.name = "Product name is required";
  } else if (data.name.trim().length < VALIDATION_RULES.name.minLength) {
    errors.name = `Name must be at least ${VALIDATION_RULES.name.minLength} characters`;
  } else if (data.name.trim().length > VALIDATION_RULES.name.maxLength) {
    errors.name = `Name must be no more than ${VALIDATION_RULES.name.maxLength} characters`;
  }

  // Price validation
  if (!data.price.trim()) {
    errors.price = "Price is required";
  } else {
    const price = parseFloat(data.price);
    if (isNaN(price)) {
      errors.price = "Price must be a valid number";
    } else if (price < VALIDATION_RULES.price.min) {
      errors.price = `Price must be at least $${VALIDATION_RULES.price.min}`;
    } else if (price > VALIDATION_RULES.price.max) {
      errors.price = `Price cannot exceed $${VALIDATION_RULES.price.max}`;
    } else if (!/^\d+(\.\d{1,2})?$/.test(data.price)) {
      errors.price = "Price can have at most 2 decimal places";
    }
  }

  // Category validation
  if (!data.category) {
    errors.category = "Category is required";
  }

  // Stock validation
  if (!data.stock.trim()) {
    errors.stock = "Stock quantity is required";
  } else {
    const stock = parseInt(data.stock);
    if (isNaN(stock)) {
      errors.stock = "Stock must be a valid number";
    } else if (stock < VALIDATION_RULES.stock.min) {
      errors.stock = "Stock cannot be negative";
    } else if (stock > VALIDATION_RULES.stock.max) {
      errors.stock = "Stock value is too large";
    } else if (!Number.isInteger(parseFloat(data.stock))) {
      errors.stock = "Stock must be a whole number";
    }
  }

  // Description validation
  if (
    data.description &&
    data.description.length > VALIDATION_RULES.description.maxLength
  ) {
    errors.description = `Description must be no more than ${VALIDATION_RULES.description.maxLength} characters`;
  }

  // Image URL validation
  if (data.imageUrl && !isValidUrl(data.imageUrl)) {
    errors.imageUrl = "Please enter a valid URL";
  }

  return errors;
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}
