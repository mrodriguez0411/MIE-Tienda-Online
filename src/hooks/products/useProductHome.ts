import { useQueries } from "@tanstack/react-query";
import { getAllProducts, getRandomProducts, getRecentProducts } from "../../actions";

//import { AllProducts, recentPoducts, popularProducts } from "../../data/initialData";

export const useProductHome = () =>{
    const results = useQueries({
        queries: [
            {
                queryKey:['recentProducts'],
                queryFn: getRecentProducts,
            },
            {    
                queryKey:['randomProduct'],
                queryFn: getRandomProducts,
            
            },
            {    
                queryKey:['AllProducts'],
                queryFn: getAllProducts,
            
            },
        ]
    });

    const [recentProductsResult , randomProduct, AllProductsResult] = results;

    //combino los resultados

    const isLoading = recentProductsResult.isLoading || randomProduct.isLoading || AllProductsResult.isLoading;
    const isError = recentProductsResult.isError || randomProduct.isError || AllProductsResult.isError;

    // Asegurarnos de que todos los productos tengan los campos necesarios y que la categoría sea del tipo correcto
    const formatProducts = (products: any[]) => {
      return products.map(product => ({
        ...product,
        price: product.variants[0]?.price || 0,
        category: {
          id: product.variants[0]?.category_id || '',
          name: product.variants[0]?.category?.name || 'Sin categoría'
        },
        category_id: product.variants[0]?.category_id || ''
      }));
    };

    return {
        recentProducts: formatProducts(recentProductsResult.data || []), 
        destacatedProducts: formatProducts(randomProduct.data || []),
        AllProducts: formatProducts(AllProductsResult.data || []),
        isLoading,
        isError,
      };
      

} 
