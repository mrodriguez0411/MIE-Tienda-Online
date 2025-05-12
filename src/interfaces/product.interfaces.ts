import { Json } from "../supabase/supabase";

export interface Category {
  id: string;
  name: string;
}

export interface Type{
    variantName: string;
    price: number;
    stock: number;
    category: string;
    category_id: string;
    created_at: string;
    id: string;
}

export interface Product{
    id: string;
    name: string;
    brand: string;
    slug: string;
    features: string[];
    description: Json;
    images: string[];
    created_at: string;
    price: number;
    category: Category; // Ahora es de tipo Category
    category_id: string;
    variants: VariantProduct[];
}
export interface VariantProduct{
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
}


export interface PreparedProducts{
    id : string;
    name: string;
    brand: string;
    slug: string;
    features: string[];
    description: Json;
    images: string[];
    created_at: string;
    price: number;
    category: string;
    category_id: string;
    variantName: string;
    variants: VariantProduct[];
}

export interface ProductInput {
	name: string;
	brand: string;
	slug: string;
	features: string[];
	description: Json;
	images: File[];
	variants: VariantInput[];
    
}
export interface VariantInput {
	id? : string;
    stock: number;
    price: number;
    category: string;
    variantName: string;
    category_id?: string;
    product_id?: string;
}