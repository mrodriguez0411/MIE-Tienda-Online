import { Brands } from "../components/home/Brands";
import { Features } from "../components/home/Features";
import { ProductGrid } from "../components/home/ProductGrid";
import { popularProducts,  recentPoducts } from "../data/initialData"
import { prepareProducts } from "../helpers";

export const HomePage = () => {
  
  const prepareRecentProducts = prepareProducts(recentPoducts);
  const preparePopularProducts = prepareProducts(popularProducts);

 
    return (
    <div>
      <Features />
      <ProductGrid 
        title="Nuevos Productos" products={prepareRecentProducts}
      />
      <ProductGrid 
        title="Productos Destacados" products= {preparePopularProducts}      />
      <Brands />
    </div>
  );
};
