import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { Category, Product, VariantProduct } from '../interfaces/products';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener categorías
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (categoriesError) throw categoriesError;

        // Obtener productos con sus variantes y categorías
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            variants (
              *,
              category:category_id (id, name)
            )
          `)
          .order('name');

        if (productsError) throw productsError;

        // Mapear los datos para que coincidan con las interfaces
        const formattedProducts = productsData?.map(product => ({
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
            productId: variant.product_id
          }) as VariantProduct)
        })) || [];

        // Asegurarnos de que los datos coincidan con el tipo Product
        const typedProducts = formattedProducts as Product[];
        setCategories(categoriesData as Category[]);
        setProducts(typedProducts);
      } catch (err) {
        setError('Error al cargar las categorías y productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    products,
    loading,
    error,
  };
};
