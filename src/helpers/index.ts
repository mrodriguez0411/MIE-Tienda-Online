import { Product, Type, VariantProduct, Category } from "../interfaces";

// Función para formatear el precio a Pesos
export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price);
};

// Función para preparar los productos

export const PreparedProducts = (products: Product[]) => {
    if (!Array.isArray(products)) {
      console.error('Expected an array of products, but received:', products);
      return [];
    }
  
    // Filtramos productos únicos por ID
    const uniqueProducts = new Map();
  
    products.forEach(product => {
      if (!uniqueProducts.has(product.id)) {
        const variantsGrouped = product.variants?.reduce((acc: Type[], variant: VariantProduct) => {
          const existingVariant = acc.find(item => item.variantName === variant.variantName);
          if (existingVariant) {
            existingVariant.price = Math.min(existingVariant.price, variant.price);
            existingVariant.stock += variant.stock;
          } else {
            acc.push({
              variantName: variant.variantName,
              price: variant.price,
              stock: variant.stock,
              category: variant.category.name,
              category_id: variant.category_id,
              product_id: variant.product_id,
              id: variant.id,
              created_at: product.created_at
            } as Type);
          }
          return acc;
        }, []) || [];
  
        uniqueProducts.set(product.id, {
          ...product,
          price: Math.min(...variantsGrouped.map(item => item.price)),
          stock: variantsGrouped.reduce((total, item) => total + item.stock, 0),
          variants: variantsGrouped,
          category: product.category.name
        });
      }
    });
  
    return Array.from(uniqueProducts.values());
  };

// Función para formatear la fecha a formato 3 de enero de 2022
export const formatDateLong = (date: string): string => {
    const dateObject = new Date(date);

    return dateObject.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Función para formatear la fecha a formato dd/mm/yyyy
export const formatDate = (date: string): string => {
    const dateObject = new Date(date);
    return dateObject.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: 'numeric',
    });
};

// Función para obtener el estado del pedido en español
export const getStatus = (status: string): string => {
    switch (status) {
        case 'Pending':
            return 'Pendiente';
        case 'Paid':
            return 'Pagado';
        case 'Shipped':
            return 'Enviado';
        case 'Delivered':
            return 'Entregado';
        default:
            return status;
    }
};

// Función para generar el slug de un producto
export const generateSlug = (name: string): string => {
    return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

// Función para extraer el path relativo al bucket de una URL
export const extractFilePath = (url: string) => {
	const parts = url.split(
		'/storage/v1/object/public/product-images/'
	);
	// EJEMPLO PARTS: ['/storage/v1/ object/public/product-images/', '02930920302302030293023-iphone-12-pro-max.jpg']

	if (parts.length !== 2) {
		throw new Error(`URL de imagen no válida: ${url}`);
	}

	return parts[1];
};