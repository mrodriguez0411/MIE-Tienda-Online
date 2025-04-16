import { ProductFormValues } from '../lib/validator';
import { ProductInput } from '../interfaces';

export const transformProductFormToInput = (
	form: ProductFormValues
): ProductInput => {
	return {
		name: form.name,
		brand: form.brand,
		slug: form.slug,
		features: form.features.map(f => f.value),
		description: form.description,
		images: form.images, // File[] o string[] (ya validado por schema)
		variants: form.variants.map(v => ({
			id: v.id,
			stock: v.stock,
			price: v.price,
			category: v.category,
			category_id: v.category_id ?? '',
			variantName: v.variantName,
		})),
	};
};
