import { supabase } from "../supabase/client";

export const getProducts = async () => {
  const {data: products , error} = await supabase.from("products")
  .select('* , variants(*)')
  .order('created_at', { ascending: false });
  
  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
  
  
  return products;
}


export const getFilteredProducts = async ({
  page = 1,
  types = [],
}:{
  page: number;
  types: string[];

}) => {
  const itemPerPage = 10;
  const from = (page - 1) * itemPerPage;
  const to = from + itemPerPage - 1;

  let query = supabase
  .from("products")
  .select('* , variants(*)', { count: 'exact' })
  .order('created_at', { ascending: false })
  .range(from, to)

  if (types.length > 0) {
    query = query.in('type', types)
  }

  const {data , error , count } = await query;

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  return { data, count };
};