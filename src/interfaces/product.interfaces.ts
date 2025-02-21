import { Json } from "../supabase/supabase";



export interface Type{
    name: string;
    type: string;
    price: number;
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
}
export interface VariantProduct{
    id : string;
    stock: number;
    price: number;
    category: string;
    type: string;
    type_name: string;
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
    types: {
        name: string;
        type: string;
    }[];
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
	type: string;
	category: string;
	typeName: string;
}