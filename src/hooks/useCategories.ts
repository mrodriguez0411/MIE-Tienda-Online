import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { Category, Product } from '../interfaces/products';

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

        // Obtener productos
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('name');

        if (productsError) throw productsError;

        setCategories(categoriesData as Category[]);
        setProducts(productsData as Product[]);
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
