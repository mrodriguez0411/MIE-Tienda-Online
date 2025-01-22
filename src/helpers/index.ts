// funcion para preparar los prodcutos
/*import { Product, Type, VariantProduct } from "../interfaces";

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
}*/

import { Product, Type, VariantProduct } from "../interfaces";

// Formatear precio en pesos argentinos
export const formarPrice = (price: number) => {
  if (typeof price !== "number" || isNaN(price)) {
    console.warn("formarPrice recibió un valor no válido:", price);
    return "N/A";
  }

  return new Intl.NumberFormat("es-Ar", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
    maximumSignificantDigits: 2,
  }).format(price);
};

// Preparar productos para su visualización
export const prepareProducts = (products: Product[]) => {
  // Validación inicial
  if (!Array.isArray(products)) {
    console.warn("prepareProducts recibió un valor no válido:", products);
    return [];
  }

  // Procesar cada producto
  return products.map((product) => {
    if (!Array.isArray(product.variants)) {
      console.warn(`El producto con ID ${product.id} no tiene variantes válidas:`, product);
      return {
        ...product,
        price: 0,
        types: [],
        variants: [],
      };
    }

    // Agrupar tipos por precio más bajo
    const types = product.variants.reduce((acc: Type[], variant: VariantProduct) => {
      const existingType = acc.find((item) => item.type === variant.type);

      if (existingType) {
        existingType.price = Math.min(existingType.price, variant.price);
      } else {
        acc.push({
          type: variant.type,
          price: variant.price,
          name: variant.name,
        });
      }
      return acc;
    }, []);

    // Calcular el precio mínimo
    const price = types.length > 0 ? Math.min(...types.map((item) => item.price)) : 0;

    return {
      ...product,
      price,
      types: types.map(({ name, type }) => ({ name, type })), // Filtrar solo las propiedades necesarias
      variants: product.variants,
    };
  });
};
