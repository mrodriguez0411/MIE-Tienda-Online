import { useQuery } from "@tanstack/react-query";
import { getFilteredProducts } from "../../actions";

export const useFilterProducts = ({
    page,
    brands,
} : {
    page: number ,
    brands: string[],
}
)=> {

    const {data, isLoading} = useQuery({

        queryKey: ['fiterProducts' , page , brands],
        queryFn:  () => getFilteredProducts({page,brands}),
        retry: false,
        staleTime: 1000 * 60 * 5,
      
        });
  
        return {data: data?.data, 
                isLoading,
                totalProduct: data?.count ?? 0,
            };

}