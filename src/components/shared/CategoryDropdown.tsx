import { useState, useEffect } from 'react';
import { IoChevronDown, IoRefresh } from 'react-icons/io5';
//import { Category, Product } from '../../interfaces/products';
import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';

export const CategoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { categories, products, loading, error } = useCategories();

  useEffect(() => {
    setIsOpen(false); // Cerrar el menú cuando los datos cambien
  }, [categories, products]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
        Productos
        <IoRefresh className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  if (error) {
    console.error('Error en CategoryDropdown:', error);
    return null;
  }

  if (!categories || !products) {
    return null;
  }

  const productsByCategory = categories.map(category => ({
    ...category,
    products: products.filter(product => product.category_id === category.id)
  }));

  return (
    <div className="relative inline-block text-left">
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
      >
        Productos
        <IoChevronDown className="w-4 h-4" />
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
          {productsByCategory.map((category) => (
            <div key={category.id}>
              <button
                onMouseEnter={() => setIsOpen(true)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                {category.name}
              </button>
              {category.products.length > 0 && (
                <div className="pl-4">
                  {category.products.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      className="block px-2 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {product.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
