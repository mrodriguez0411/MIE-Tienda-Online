export interface Category {
  id: string;
  name: string;
}

export interface Type {
  id: string;
  variantName: string;
  price: number;
  stock: number;
  category: string;
  category_id: string;
  product_id: string;
  created_at: string;
}

export interface VariantProduct {
  id: string;
  stock: number;
  price: number;
  category: {
    id: string;
    name: string;
  };
  variantName: string;
  category_id: string;
  product_id: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  features: string[];
  description: any; // Usar Json si está disponible
  images: string[];
  created_at: string;
  price: number;
  category_id: string;
  category: Category;
  variants: VariantProduct[];
}

export interface CategoryWithProducts extends Category {
  products: Product[];
}
