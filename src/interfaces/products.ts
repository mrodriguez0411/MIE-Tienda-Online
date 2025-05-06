export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface VariantProduct {
  id: string;
  productId: string;
  variantName: string;
  price: number;
  stock: number;
  category_id: string;
  category: Category;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  images: string[];
  category_id: string;
  category: Category;
  variants: VariantProduct[];
}

export interface CategoryWithProducts extends Category {
  products: Product[];
}
