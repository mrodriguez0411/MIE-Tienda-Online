import { useCategories } from '../../hooks/useCategories';
import { CategoryMenu } from './CategoryMenu';
import { Loader } from '../../components/shared/Loader';

export const ProductCategories = () => {
  const { categories, products, loading, error } = useCategories();

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Nuestros Productos</h2>
      <CategoryMenu categories={categories} products={products} />
    </div>
  );
};
