// funcion para preparar los prodcutos

import { Product, Type, VariantProduct } from "../interfaces";

export const formarPrice = (price: number) => {
    return new Intl.NumberFormat('es-Ar', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 2,
        maximumSignificantDigits: 2,
    }).format(price);
};

export const prepareProducts = (products: Product[]) => {
    return products.map(product => {
        const types = product.variants.reduce((acc: Type[], variant: VariantProduct) => {
            const existingType = acc.find(item => item.price === variant.price);

            if(existingType) {
                existingType.price = Math.min(existingType.price, variant.price);
            }
            else { 
                acc.push({
                
                    type: variant.type,
                    price: variant.price,
                    name: variant.name,
                });
            }
            return acc;   
        },[]);
        const price = Math.min(...types.map((item) => item.price));
        return {
            ...product,
            price,
            types: types.map(({name, type}) => ({name, type})),
            variants: product.variants,
        };
    });
}