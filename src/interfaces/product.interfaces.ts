import { Json } from "../supabase/supabase";



export interface Type{
    variant_name: string;
    price: number;
    stock: number;
    category: string;
    category_id: number;
    created_at: string;
}

export interface Product{
    id : string;
    name: string;
    brand: string;
    slug: string;
    features: string[];
    description: Json;
    images: string[];
    created_at: string;
    variants: VariantProduct[];
    price?: number;
}
export interface VariantProduct{
    id : string;
    stock: number;
    price: number;
    category: string;
    variant_name: string;
    category_id: number;
    created_at: string;
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
    variant_name:string;
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
	id?: string;
	stock: number;
	price: number;
	category: string;
	variantName: string;
    categoryId: number;
}