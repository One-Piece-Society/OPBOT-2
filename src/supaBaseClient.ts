import { createClient } from "@supabase/supabase-js";

// SOME CONSTANTS
const Project_URL = process.env?.Project_URL;
const PUBLIC_ANON_KEY = process.env?.PUBLIC_ANON_KEY;

if (!Project_URL) throw new Error("Missing Project_URL environment variable.");
if (!PUBLIC_ANON_KEY)
  throw new Error("Missing PUBLIC_ANON_KEY environment variable.");

// Create a single supabase client for interacting with your database
export const supabase = createClient(Project_URL, PUBLIC_ANON_KEY);
