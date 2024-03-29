import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, GUILD_ID, ADMIN_ROLE_IDS } =
    process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !GUILD_ID || !ADMIN_ROLE_IDS) {
    throw new Error("Missing environment variables");
}

/**
 * Wrapper for environment variables to make sure the
 * program functions as intended
 */
export const config = {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
    GUILD_ID,
    ADMIN_ROLE_IDS,
};
