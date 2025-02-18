
import { JSONContent } from "@tiptap/react";
import { Json } from "../supabase/supabase";

export interface Type{
    name: string;
    type: string;
    price: number;
}

export interface VariantProduct{
    id : string;
    stock: number;
    price: number;
    category: string;
    type: string;
    type_name: string;
}
export interface Product{
    id : string;
    name: string;
    brand: string;
    slug: string;
    features: string[];
    descriptions: Json;
    images: string[];
    created_art: string;
    variants: VariantProduct[];
}

export interface PreparedProducts{
    id : string;
    name: string;
    brand: string;
    slug: string;
    features: string[];
    descriptions: Json;
    images: string[];
    created_art: string;
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
	description: JSONContent;
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