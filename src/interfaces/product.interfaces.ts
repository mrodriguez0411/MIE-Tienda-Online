import { Json } from "../supabase/supabase";



export interface Type{
    variantName: string;
    price: number;
    stock: number;
    category: string;
    created_at: string;
    id: string;
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
    variantName?: string;
    category: string;
    category_id: string;
}
export interface VariantProduct{
    id : string;
    stock: number;
    price: number;
    category: string;
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
    variantName:string;
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