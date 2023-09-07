import { createClient } from "@supabase/supabase-js";

// SOME CONSTANTS
const Project_URL = process.env?.Project_URL;
const SERVICE_KEY = process.env?.SERVICE_KEY;

if (!Project_URL) throw new Error("Missing Project_URL environment variable.");
if (!SERVICE_KEY) throw new Error("Missing SERVICE_KEY environment variable.");

// Create a single supabase client for interacting with your database
const options = {
  auth: { persistSession: false },
};

export const supabase = createClient(Project_URL, SERVICE_KEY, options);
