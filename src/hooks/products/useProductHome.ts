import { useQueries } from "@tanstack/react-query";
import { getAllProducts, getRandomProducts, getRecentProducts } from "../../actions";

//import { AllProducts, recentPoducts, popularProducts } from "../../data/initialData";

export const useProductsHome = () =>{
    const results = useQueries({
        queries: [
            {
                queryKey:['recentProducts'],
                queryFn: getRecentProducts,
            },
            {    
                queryKey:['popularProducts'],
                queryFn: getRandomProducts,
            
            },
            {    
                queryKey:['AllProducts'],
                queryFn: getAllProducts,
            
            },
        ]
    });

    const [recentProductsResult , popularProducts, AllProductsResult] = results;

    //combino los resultados

    const isLoading = recentProductsResult.isLoading || popularProducts.isLoading || AllProductsResult.isLoading;
    const isError = recentProductsResult.isError || popularProducts.isError || AllProductsResult.isError;

    return {
        recentProducts: recentProductsResult.data || [], 
        destacatedProducts: popularProducts.data || [],
        AllProducts: AllProductsResult.data || [],
        isLoading,
        isError,
      };
      

} 
