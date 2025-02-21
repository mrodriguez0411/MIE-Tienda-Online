import { Brands } from "../components/home/Brands";
import { Features } from "../components/home/Features";
import { ProductGrid } from "../components/home/ProductGrid";
import { ProductGridsSkeletons } from "../components/skeletons/ProductGridSkeletons";
import { PreparedProducts } from "../helpers/index";
import { useProductsHome } from "../hooks";
//import { productSchema } from "../lib/validator";
export const HomePage = () => {
  const { recentProducts , popularProducts, isLoading } = useProductsHome();

  const prepareRecentProducts = PreparedProducts(recentProducts);
  const preparePopularProducts = PreparedProducts(popularProducts);

  return (
    <div>
      <Features />

      {isLoading ? (
        <ProductGridsSkeletons numberOfProducts={4} />
      ) : (
        <ProductGrid
          title="Nuevos Productos"
          products={prepareRecentProducts}
        />
      )}
      {isLoading ? (
        <ProductGridsSkeletons numberOfProducts={4} />
      ) : (
        <ProductGrid
          title="Productos Destacadosss"
          products={preparePopularProducts}
        />
      )}

      <Brands />
    </div>
  );
};
