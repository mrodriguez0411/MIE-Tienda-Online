import { Brands } from "../components/home/Brands";
import { Features } from "../components/home/Features";
import { ProductGrid } from "../components/home/ProductGrid";
import { ProductGridsSkeletons } from "../components/skeletons/ProductGridSkeletons";
import { prepareProducts } from "../helpers";
//import { useProducts } from "../hooks";
import { useProductsHome } from "../hooks";
//import { productSchema } from "../lib/validator";

export const HomePage = () => {
  const { recentPoducts, popularProducts, isLoading } = useProductsHome();

  const prepareRecentProducts = prepareProducts(recentPoducts);
  const preparePopularProducts = prepareProducts(popularProducts);

  return (
    <div>
      <Features />

      {isLoading ? (
        <ProductGridsSkeletons numberOfProducts={10} />
      ) : (
        <ProductGrid
          title="Nuevos Productos"
          products={prepareRecentProducts}
        />
      )}
      {isLoading ? (
        <ProductGridsSkeletons numberOfProducts={10} />
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
