import { Client, GatewayIntentBits, Partials } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { adminCommands, userCommands } from "./commands/command-list";
import { config } from "./config";
import { isAdmin } from "./functions/permissions";

/**
 * Create a new Discord Client and set its intents to determine which events
 * the bot will receive information about.
 */
export const client = new Client({
    partials: [Partials.Channel, Partials.User, Partials.Message],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
    ],
});

client.once("ready", () => {
    console.log("Discord bot is ready! 🤖");
    deployCommands({ guildId: config.GUILD_ID });
});

/**
 * Watches for messages from webhook channel
 */
client.on("messageCreate", async (message) => {
    //
    if (message.content.includes("OPSOC BOT")) return;
});

/**
 * Run corresponding commands when new user interaction has been created
 */
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;

    if (userCommands[commandName as keyof typeof userCommands]) {
        await userCommands[commandName as keyof typeof userCommands].execute(
            interaction
        );
    }

    if (adminCommands[commandName as keyof typeof adminCommands]) {
        if (!isAdmin(interaction)) return;
        await adminCommands[commandName as keyof typeof adminCommands].execute(
            interaction
        );
    }
});

/**
 * Login the client using the bot token
 */
client.login(config.DISCORD_TOKEN);
