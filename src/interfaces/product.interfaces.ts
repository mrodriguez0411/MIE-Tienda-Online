import { JSONContent } from "@tiptap/react";

export interface Type{
    name: string;
    type: string;
    price: number;
}

export interface VariantProduct{
    id : string;
    stock: number;
    price: number;
    type: string;
    type_name: string;
}
export interface Product{
    id : string;
    name: string;
    brand: string;
    descriptions: JSONContent;
    images: string[];
    created_art: string;
    variants: VariantProduct[];
}

export interface PreparedProducts{
    id : string;
    name: string;
    brand: string;
    descriptions: JSONContent;
    images: string[];
    created_art: string;
    price: number;
    types: {
        name: string;
        type: string;
    }[];
    variants: VariantProduct[];
}