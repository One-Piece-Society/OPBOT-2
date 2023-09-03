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
import { createEvent, removeEvent, getEvents } from "./dbFunctions";
import { isAdmin } from "./util";

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
    name: "ping",
    description: "check if bot is working",
  },
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
        name: "delay",
        description: "A time delay of n minutes",
        type: 3,
        required: false,
      },
      {
        name: "datetime",
        description: `The date and time for the scheduled post in "HHmmDDMMYYYY" 24 hour time format`,
        type: 4, // Representing the date-time format
        required: false,
      },
    ],
  },
  {
    name: "event-info",
    description: "See a list of most recent events",
    options: [
      {
        name: "Start",
        description: "Show result starting from the nth entry (default 1st entry)",
        type: 3,
        required: false,
      },
    ]
  },
  {
    name: "add-event",
    description: "Schedule a post to be sent in a specific channel",
    options: [
      // TODO FIX REQUIRED FOR VARS USAGE
      {
        name: "url",
        description: " ",
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
        name: "delay",
        description: "A time delay of n minutes",
        type: 3,
        required: false,
      },
      {
        name: "datetime",
        description: `The date and time for the scheduled post in "HHmmDDMMYYYY" 24 hour time format`,
        type: 4, // Representing the date-time format
        required: false,
      },
    ],
  },
  {
    name: "remove-event",
    description: "Remove an event based on an id",
    options: [
      {
        name: "id",
        description: "id of event to remove",
        type: 3,
        required: true,
      },
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
    if (interaction.commandName === "post" && isAdmin(interaction)) {
      createPost(client, interaction as CommandInteraction);
    } else if (
      interaction.commandName === "add-event" &&
      isAdmin(interaction)
    ) {
      createEvent(client, interaction as CommandInteraction);
    } else if (
      interaction.commandName === "event-info" &&
      isAdmin(interaction)
    ) {
      getEvents(client, interaction as CommandInteraction);
    } else if (
      interaction.commandName === "remove-event" &&
      isAdmin(interaction)
    ) {
      removeEvent(client, interaction as CommandInteraction);
    }
  }

  if (interaction.channel instanceof DMChannel) {
    // do DM channel functions
  }

  // non dm or channel specific commands go here:
  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
  if (interaction.commandName === "about") {
    await interaction.reply(
      "I am a bot made for UNSW One Piece Society, Looking for new feature requests here: https://github.com/One-Piece-Society/OPBOT-2/issues ✨"
    );
  }
});

// Log in to Discord with your client's token
client.login(TOKEN);
