import { extractFilePath } from "../helpers";
import { ProductInput } from "../interfaces";
import { supabase } from "../supabase/client";

// ======================== GETTERS ======================== //

export const getProducts = async (page: number) => {
	const itemsPerPage = 10;
	const from = (page - 1) * itemsPerPage;
	const to = from + itemsPerPage - 1;

	const {
		data: products,
		error,
		count,
	} = await supabase
		.from('products')
		.select('*, variants(*)',  { count: 'exact' })
		.order('created_at', { ascending: false })
		.range(from, to);

	if (error) throw new Error(error.message);

	return { products, count };
};

export const getFilteredProducts = async ({ page = 1, brands = [] }: { page: number; brands: string[] }) => {
	const itemPerPage = 10;
	const from = (page - 1) * itemPerPage;
	const to = from + itemPerPage - 1;

	let query = supabase
		.from("products")
		.select("*, variants(*)", { count: "exact" })
		.order("created_at", { ascending: false })
		.range(from, to);

	if (brands.length > 0) {
		query = query.in('brand', brands);
	}

	const { data, error, count } = await query;
	if (error) throw new Error(error.message);

	return { data, count };
};

export const getRecentProducts = async () => {
	const { data: products, error } = await supabase
		.from("products")
		.select("*,variants(*)")
		.order("created_at", { ascending: false })
		.limit(4);
	if (error) throw new Error(error.message);
	return products;
};

export const getRandomProducts = async () => {
	const { data, error } = await supabase
		.from('products')
		.select('*, variants(*)')
		.limit(20);
	if (error) throw new Error(error.message);
	return data.sort(() => 0.5 - Math.random()).slice(0, 4);
};

export const getDestacatedProducts = async () => {
	const { data, error } = await supabase
		.from("products")
		.select("*")
		.eq("destacated", true)
		.order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data;
};

export const getAllProducts = async () => {
	const { data, error } = await supabase
		.from("products")
		.select("*")
		.order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data;
};

export const getProductBySlug = async (slug: string) => {
	const { data, error } = await supabase
		.from("products")
		.select("*, variants(*)")
		.eq("slug", slug)
		.single();
	if (error) throw new Error(error.message);
	return data;
};

export const searchProducts = async (searchTerm: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
       .select(`
         *,
         variants (
           *,
           category:category_id (
             id,
             name
           )
         )
       `)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('name');

    if (error) throw new Error(error.message);
    
    if (data) {
      return data.map(product => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        slug: product.slug,
        features: product.features,
        description: product.description,
        images: product.images,
        created_at: product.created_at,
        price: product.variants[0]?.price || 0,
        category: {
          id: product.variants[0]?.category?.id || '',
          name: product.variants[0]?.category?.name || ''
        },
        category_id: product.variants[0]?.category_id || '',
        variants: product.variants.map(variant => ({
          id: variant.id,
          stock: variant.stock,
          price: variant.price,
          category: {
            id: variant.category?.id || '',
            name: variant.category?.name || ''
          },
          variantName: variant.variant_name,
          category_id: variant.category_id,
          product_id: variant.product_id,
          
        }))
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};/*
		  )
		`)
		.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
		.order('name');
  
	  if (error) throw error;
  
	  // Transformar los datos para que coincidan con la interfaz
	  const formattedProducts = products?.map(product => ({
		...product,
		category: product.category, // Ya viene de la base de datos
		variants: product.variants.map(variant => ({
		  ...variant,
		  category: variant.category // Ya viene de la base de datos
		}))
	  }));
  
	  return formattedProducts || [];
	} catch (error) {
	  console.error('Error searching products:', error);
	  return [];
	}
  };*/

// ======================== CREATE ======================== //

export const createProduct = async (productInput: ProductInput) => {
	try {
		const { data: product, error: productError } = await supabase
			.from('products')
			.insert({
				name: productInput.name,
				brand: productInput.brand,
				slug: productInput.slug,
				features: productInput.features,
				description: productInput.description,
				images: [],
			})
			.select()
			.single();

		if (productError) throw new Error(productError.message);

		const folderName = product.id;

		const uploadedImages = await Promise.all(
			productInput.images.map(async image => {
				if (image instanceof File) {
					const { data, error } = await supabase.storage
						.from('product-images')
						.upload(`${folderName}/${product.id}-${image.name}`, image);
					if (error) throw new Error(error.message);

					return supabase.storage
						.from('product-images')
						.getPublicUrl(data.path).data.publicUrl;
				} else if (typeof image === 'string') {
					return image;
				} else {
					throw new Error('Tipo de imagen no soportado');
				}
			})
		);

		await supabase.from('products')
			.update({ images: uploadedImages })
			.eq('id', product.id);

		const variants = productInput.variants.map(variant => ({
			product_id: product.id,
			stock: variant.stock,
			price: variant.price,
			category_id: variant.category_id ?? '',
			variant_name: variant.variantName,
			category: variant.category,
		}));

		const { error: variantsError } = await supabase
			.from('variants')
			.insert(variants);

		if (variantsError) throw new Error(variantsError.message);
		return product;
	} catch (error) {
		console.error(error);
		throw new Error('Error inesperado, vuelva a intentarlo');
	}
};

// ======================== UPDATE ======================== //

export const updateProduct = async (
	productId: string,
	productInput: ProductInput
) => {
	const { data: currentProduct, error: currentProductError } = await supabase
		.from('products')
		.select('images')
		.eq('id', productId)
		.single();
	if (currentProductError) throw new Error(currentProductError.message);

	const existingImages = currentProduct.images || [];

	const { data: updatedProduct, error: productError } = await supabase
		.from('products')
		.update({
			name: productInput.name,
			brand: productInput.brand,
			slug: productInput.slug,
			features: productInput.features,
			description: productInput.description,
		})
		.eq('id', productId)
		.select()
		.single();
	if (productError) throw new Error(productError.message);

	const folderName = productId;
	const validImages = productInput.images.filter(Boolean) as (File | string)[];

	const imagesToDelete = existingImages.filter(img => !validImages.includes(img));
	const filesToDelete = imagesToDelete.map(extractFilePath);

	if (filesToDelete.length > 0) {
		const { error: deleteImagesError } = await supabase.storage
			.from('product-images')
			.remove(filesToDelete);
		if (deleteImagesError) throw new Error(deleteImagesError.message);
	}

	const uploadedImages = await Promise.all(
		validImages.map(async image => {
			if (image instanceof File) {
				const { data, error } = await supabase.storage
					.from('product-images')
					.upload(`${folderName}/${productId}-${image.name}`, image);
				if (error) throw new Error(error.message);

				return supabase.storage
					.from('product-images')
					.getPublicUrl(data.path).data.publicUrl;
			} else {
				return image;
			}
		})
	);

	await supabase.from('products')
		.update({ images: uploadedImages })
		.eq('id', productId);

	const existingVariants = productInput.variants.filter(v => v.id);
	const newVariants = productInput.variants.filter(v => !v.id);

	if (existingVariants.length > 0) {
		const { error: updateVariantsError } = await supabase
			.from('variants')
			.upsert(
				existingVariants.map(variant => ({
					id: variant.id,
					product_id: productId,
					stock: variant.stock,
					price: variant.price,
					variant_name: variant.variantName,
					category_id: variant.category_id ?? '',
					category: variant.category,
				})),
				{ onConflict: 'id' }
			);
		if (updateVariantsError) throw new Error(updateVariantsError.message);
	}

	let newVariantIds: string[] = [];
	if (newVariants.length > 0) {
		const { data, error: insertVariantsError } = await supabase
			.from('variants')
			.insert(
				newVariants.map(variant => ({
					product_id: productId,
					stock: variant.stock,
					price: variant.price,
					category_id: variant.category_id ?? '',
					variant_name: variant.variantName,
					category: variant.category,
				}))
			)
			.select();
		if (insertVariantsError) throw new Error(insertVariantsError.message);
		newVariantIds = data.map(v => v.id);
	}

	const currentVariantIds = [
		...existingVariants.map(v => v.id),
		...newVariantIds,
	];

	if (currentVariantIds.length > 0) {
		const { error: deleteVariantsError } = await supabase
			.from('variants')
			.delete()
			.eq('product_id', productId)
			.not('id', 'in', `(${currentVariantIds.join(',')})`);
		if (deleteVariantsError) throw new Error(deleteVariantsError.message);
	}

	return updatedProduct;
};

// ======================== DELETE ======================== //

export const deleteProduct = async (productId: string) => {
	const { error: variantsError } = await supabase
		.from('variants')
		.delete()
		.eq('product_id', productId);
	if (variantsError) throw new Error(variantsError.message);

	const { data: productImages, error: productImagesError } = await supabase
		.from('products')
		.select('images')
		.eq('id', productId)
		.single();
	if (productImagesError) throw new Error(productImagesError.message);

	const { error: productDeleteError } = await supabase
		.from('products')
		.delete()
		.eq('id', productId);
	if (productDeleteError) throw new Error(productDeleteError.message);

	if (productImages.images.length > 0) {
		const folderName = productId;
		const paths = productImages.images.map((img: string) => {
			const fileName = img.split('/').pop();
			return `${folderName}/${fileName}`;
		});

		const { error: storageError } = await supabase.storage
			.from('product-images')
			.remove(paths);
		if (storageError) throw new Error(storageError.message);
	}

	return true;
};
