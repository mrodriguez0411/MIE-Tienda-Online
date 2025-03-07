// funcion para preparar los prodcutos
import { Product, Type, VariantProduct } from "../interfaces";

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
	return products.map(product => {
		const types = product.variants.reduce((acc: Type[], variant: VariantProduct) => {
			const existingType = acc.find(item => item.variant_name === variant.variant_name);

			if (existingType) {
				existingType.price = Math.min(existingType.price, variant.price);
			} else {
				acc.push({
					variant_name: variant.variant_name,
					price: variant.price,
				});
			}
			return acc;
		}, []);
		const price = Math.min(...types.map(item => item.price));
		return {
			...product,
			price,
			variants: types.map(({ price, variant_name }) => ({ price, variant_name })),
			types: product.variants,
		  };
		});


/*export const PreparedProducts = (products: Product[]) => {
    if (!Array.isArray(products)) {
        console.error('Expected an array of products, but received:', products);
        return [];
    }

    // Filtramos productos únicos por ID
    const uniqueProducts = new Map();

    products.forEach(product => {
        if (!uniqueProducts.has(product.id)) {
            const variantsGrouped = product.variants.reduce((acc: Type[], variant: VariantProduct) => {
                const existingVariant = acc.find(item => item.variant_name === variant.variant_name);
                if (existingVariant) {
                    existingVariant.price = Math.min(existingVariant.price, variant.price);
                } else {
                    acc.push({
                        variant_name: variant.variant_name,
                        price: variant.price,
                    });
                }
                return acc;
            }, []);

            uniqueProducts.set(product.id, {
                ...product,
                price: Math.min(...variantsGrouped.map(item => item.price)),
                variants: variantsGrouped,
            });
        }
    });

	)};*/

	
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