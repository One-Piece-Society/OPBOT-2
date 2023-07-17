import {
  Client,
  GatewayIntentBits,
  Partials,
  Message,
  DMChannel,
  TextChannel,
  Interaction,
  REST,
  Routes,
  CommandInteraction,
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();

import { createPost } from "./postFunctions";

// SOME CONSTANTS
const TOKEN = process.env?.TOKEN;
const CLIENT_ID = process.env?.CLIENT_ID;

if (!TOKEN) throw new Error("Missing TOKEN environment variable.");
const rest = new REST({ version: "9" }).setToken(TOKEN);

// Create a new client instance
const client = new Client({
  partials: [Partials.Channel, Partials.User, Partials.Message],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
  ],
});

const commands = [
  {
    name: "about",
    description: "What does this bot do?",
  },
  {
    name: "post",
    description: "Schedule a post to be sent in a specific channel",
    options: [
      {
        name: "url",
        description: "The message link you wish to post",
        type: 3,
        required: true,
      },
      {
        name: "channel",
        description: "The message link you wish to post",
        type: 7,
        required: true,
      },
      {
        name: "time",
        description: "A specified time using HH:MM",
        type: 3,
        required: false,
      },
      // {
      //   name: "day",
      //   description: "A specified day using day number (eg. 23)",
      //   type: 3,
      //   required: false,
      // },
    ],
  },
];

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.on("ready", async () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  try {
    console.log("Started refreshing application (/) commands.");

    if (CLIENT_ID)
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
});

// Takes all media input from head channel
client.on("messageCreate", async (message: Message): Promise<any> => {
  if (message.author.bot) return;
});

// commands used by users who want to follow or un-follow posts
client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;
  if (interaction.channel instanceof TextChannel) {
    // do text channel functions
  }
  if (interaction.channel instanceof DMChannel) {
    // do DM channel functions
  }
  if (interaction.commandName === "about") {
    await interaction.reply(
      "I am a bot made for UNSW One Piece Society, Looking for new feature requests here: https://github.com/One-Piece-Society/OPBOT-2/issues ✨"
    );
  }
  if (interaction.commandName === "post") {
    createPost(client, interaction as CommandInteraction);
  }
});

// Log in to Discord with your client's token
client.login(TOKEN);
