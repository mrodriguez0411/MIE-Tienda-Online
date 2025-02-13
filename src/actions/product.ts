import { supabase } from "../supabase/client";

export const getProducts = async (page:number) => {
  const itemPerPage = 10;
  const from = (page - 1) * itemPerPage;
  const to = from + itemPerPage - 1;

  const { data: products, error, count } = await supabase
    .from("products")
    .select("* , variants(*)", {count: 'exact'})
    .order("created_at", { ascending: false }).range(from, to);

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return {products, count};
};

export const getFilteredProducts = async ({
  page = 1,
  types = [],
}: {
  page: number;
  types: string[];
}) => {
  const itemPerPage = 10;
  const from = (page - 1) * itemPerPage;
  const to = from + itemPerPage - 1;

  let query = supabase
    .from("products")
    .select("* , variants(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (types.length > 0) {
    query = query.in("type", types);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  return { data, count };
};

export const getRecentProducts = async () => {
  const { data: products, error } = await supabase
    .from("products")
    .select("*,variants(*)")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  return products;
};

export const getDestacatedProducts = async () => {
  const { data: products, error } = await supabase
    .from("products")
    .select("*") // Selecciona todas las columnas o las necesarias
    .eq("destacated", true) // Filtra donde la columna 'destacated' sea igual a 'SI'
    .order("created_at", { ascending: false }); // Ordena por fecha de creación de forma descendente

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  return products;
};

export const getAllProducts = async () => {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("type", { ascending: false });

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  return products;
};
