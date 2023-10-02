import { Client, GatewayIntentBits } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { adminCommands, commands } from "./commands/command-list";
import { config } from "./config";
import { isAdmin } from "./functions/permissions";

/**
 * Create a new Discord Client and set its intents to determine which events
 * the bot will receive information about.
 */
const client = new Client({
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

    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }

    if (adminCommands[commandName as keyof typeof adminCommands]) {
        if (!isAdmin(interaction)) return;
        adminCommands[commandName as keyof typeof adminCommands].execute(
            interaction
        );
    }
});

/**
 * Login the client using the bot token
 */
client.login(config.DISCORD_TOKEN);
