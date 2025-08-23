import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

export const createClient = () => {
  const client = createBrowserClient(supabaseUrl, supabaseKey);

  // Test the client connection
  client.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error("Supabase client connection error:", error);
    } else {
      console.log("Supabase client connected successfully");
    }
  });

  return client;
};
