import { useState, useEffect } from 'react';
import { Product, Category, CategoryWithProducts } from '../../interfaces/products';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { supabase } from '../../supabase/client';

interface CategoryMenuProps {
  categories: Category[];
  products: Product[];
}

export const CategoryMenu = ({ categories, products }: CategoryMenuProps) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<CategoryWithProducts[]>([]);

  useEffect(() => {
    // Agrupar productos por categoría
    const productsByCategory = categories.map(category => ({
      ...category,
      products: products.filter(product => product.category_id === category.id)
    }));

    setCategoryProducts(productsByCategory);
  }, [categories, products]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(prev => prev === categoryId ? null : categoryId);
  };

  return (
    <div className="w-full">
      {categoryProducts.map((category) => (
        <div key={category.id} className="border-b border-gray-200">
          <button
            onClick={() => toggleCategory(category.id)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg font-medium">{category.name}</span>
            {expandedCategory === category.id ? (
              <IoChevronUp className="w-5 h-5" />
            ) : (
              <IoChevronDown className="w-5 h-5" />
            )}
          </button>

          {expandedCategory === category.id && category.products.length > 0 && (
            <div className="pl-6 py-2">
              {category.products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-2 hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-gray-600">{product.brand}</p>
                    <p className="font-semibold">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
