import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABESE_URL,
  process.env.SUPABASE_KEY
);
