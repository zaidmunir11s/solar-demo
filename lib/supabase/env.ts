/**
 * Reads the Supabase connection settings from the environment.
 *
 * Both values are public by design: the URL and the publishable key are
 * meant to be shipped to the browser. They grant no data access on their own -
 * every request is still evaluated against Row Level Security using the signed
 * in user's JWT. The service-role key is not used anywhere in this project.
 */
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. See .env.example.",
    );
  }

  return { url, publishableKey };
}
