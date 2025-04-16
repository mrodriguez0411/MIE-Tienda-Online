import { useQuery } from "@tanstack/react-query"
import { getProductBySlug } from "../../actions"



export const useProduct = (slug: string) =>
{
    const isEnabled = Boolean(slug);
    const {
        data: product,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["product", slug],
        queryFn: () =>getProductBySlug(slug),
        enabled: isEnabled,
        retry: false,
    });
    return { product, isLoading, isError };
}