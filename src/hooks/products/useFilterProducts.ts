import { useQuery } from "@tanstack/react-query";
import { getFilteredProducts } from "../../actions";
import { Product, VariantProduct } from "../../interfaces";

interface SupabaseResponse {
  products: Product[];
  count: number | null;
}

export const useFilterProducts = ({
  page,
  brands,
}: {
  page: number ;
  brands: string[],
}) => {

  const {data, isLoading} = useQuery<SupabaseResponse>({
    queryKey: ['fiterProducts' , page , brands],
    queryFn:  () => getFilteredProducts({page,brands}),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // Asegurarnos de que los productos tengan los campos necesarios y que la categoría sea del tipo correcto
  const productsWithFields = (data?.products || []).map((product: Product) => ({
    ...product,
    price: product.variants[0]?.price || 0,
    category: {
      id: product.variants[0]?.category_id || '',
      name: product.variants[0]?.category?.name || 'Sin categoría'
    },
    category_id: product.variants[0]?.category_id || '',
    variants: product.variants?.map((variant: VariantProduct) => ({
      id: variant.id,
      product_id: variant.product_id,
      variantName: variant.variantName,
      price: variant.price,
      stock: variant.stock,
      category: {
        id: variant.category_id,
        name: variant.category?.name || 'Sin categoría'
      },
      category_id: variant.category_id
    })) || []
  })); // Aseguramos que category sea siempre del tipo Category

  return {
    data: productsWithFields,
    isLoading,
    totalProduct: data?.count ?? 0,
  };
}