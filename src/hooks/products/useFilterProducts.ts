import { useQuery } from "@tanstack/react-query";
import { getFilteredProducts } from "../../actions";

export const useFilterProducts = ({
  page,
  brands,
}: {
  page: number ;
  brands: string[],
}) => {

  const {data, isLoading} = useQuery({
    queryKey: ['fiterProducts' , page , brands],
    queryFn:  () => getFilteredProducts({page,brands}),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // Asegurarnos de que los productos tengan los campos necesarios y que la categoría sea del tipo correcto
  const productsWithFields = data?.data?.map(product => ({
    ...product,
    price: product.variants[0]?.price || 0,
    category: {
      id: product.variants[0]?.category_id || '',
      name: product.variants[0]?.category?.name || 'Sin categoría'
    },
    category_id: product.variants[0]?.category_id || ''
  })) || []; // Aseguramos que category sea siempre del tipo Category

  return {
    data: productsWithFields,
    isLoading,
    totalProduct: data?.count ?? 0,
  };
}