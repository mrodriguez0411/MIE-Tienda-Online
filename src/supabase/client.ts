import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase";

const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);