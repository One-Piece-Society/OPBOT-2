// Export the variables as a module
export default class Env {
  public getEnv = () => {
    // Check if environment variables exist
    if (!process.env?.TOKEN) {
      throw new Error("Error: TOKEN environment variable is not set.");
    }

    if (!process.env?.CLIENT_ID) {
      throw new Error("Error: CLIENT_ID environment variable is not set.");
    }

    // Import ADMIN_ROLE_IDS dynamically
    const ADMIN_ROLE_IDS = process.env?.ADMIN_ROLE_IDS
      ? JSON.parse(process.env?.ADMIN_ROLE_IDS)
      : [];

    if (!process.env?.DATABASE_URL) {
      throw new Error("Error: DATABASE_URL environment variable is not set.");
    }
    return {
      TOKEN: process.env?.TOKEN,
      CLIENT_ID: process.env?.CLIENT_ID,
      ADMIN_ROLE_IDS,
      DATABASE_URL: process.env?.DATABASE_URL,
    };
  };
}
