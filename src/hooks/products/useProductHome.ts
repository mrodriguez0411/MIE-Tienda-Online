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

    return {
        recentProducts: recentProductsResult.data || [], 
        destacatedProducts: randomProduct.data || [],
        AllProducts: AllProductsResult.data || [],
        isLoading,
        isError,
      };
      

} 
