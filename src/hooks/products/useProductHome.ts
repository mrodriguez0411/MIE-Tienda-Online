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
      if (!Array.isArray(products)) {
        console.log('formatProducts received non-array input:', products);
        return [];
      }
      
      console.log('Raw products data:', products);
      
      const formattedProducts = products.map(product => {
        // Si el producto ya tiene variantes, lo devolvemos con la estructura correcta
        if (product.variants && product.variants.length > 0) {
          return {
            ...product,
            price: product.price || product.variants[0]?.price || 0,
            category: product.category || product.variants[0]?.category || { id: '', name: 'Sin categoría' },
            category_id: product.category_id || product.variants[0]?.category_id || ''
          };
        }
        
        // Si no tiene variantes, creamos una variante por defecto
        return {
          ...product,
          variants: [{
            id: product.id,
            variantName: 'Único',
            price: product.price || 0,
            stock: product.stock || 0,
            category: product.category || { id: '', name: 'Sin categoría' },
            category_id: product.category_id || '',
            product_id: product.id
          }],
          price: product.price || 0,
          category: product.category || { id: '', name: 'Sin categoría' },
          category_id: product.category_id || ''
        };
      });
      
      console.log('Formatted products:', formattedProducts);
      return formattedProducts;
    };

    return {
        recentProducts: formatProducts(recentProductsResult.data || []), 
        destacatedProducts: formatProducts(randomProduct.data || []),
        AllProducts: formatProducts(AllProductsResult.data || []),
        isLoading,
        isError,
      };
      

} 
