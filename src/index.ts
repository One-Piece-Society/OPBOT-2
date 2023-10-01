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
    CommandInteraction
} from 'discord.js';

import { createPost } from './commands/postFunctions';
import Env from './env';
import Helpers from './commands/Helpers';

// SOME CONSTANTS
const env = new Env().getEnv();
const TOKEN = env.TOKEN;
const CLIENT_ID = env.CLIENT_ID;
const util = new Helpers();

if (!TOKEN) throw new Error('Missing TOKEN environment variable.');
const rest = new REST({ version: '9' }).setToken(TOKEN);

// Create a new client instance
const client = new Client({
    partials: [Partials.Channel, Partials.User, Partials.Message],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping
    ]
});

const commands = [
    {
        name: 'ping',
        description: 'check if bot is working'
    },
    {
        name: 'about',
        description: 'What does this bot do?'
    },
    {
        name: 'post',
        description: 'Schedule a post to be sent in a specific channel',
        options: [
            {
                name: 'url',
                description: 'The message link you wish to post',
                type: 3,
                required: true
            },
            {
                name: 'channel',
                description: 'The message link you wish to post',
                type: 7,
                required: true
            },
            {
                name: 'delay',
                description: 'A time delay of n minutes',
                type: 3,
                required: false
            },
            {
                name: 'datetime',
                description: `The date and time for the scheduled post in "HHmmDDMMYYYY" 24 hour time format`,
                type: 4, // Representing the date-time format
                required: false
            }
        ]
    },
    {
        name: 'events',
        description: 'See a list of the 10 most recent events',
        options: [
            {
                name: 'page',
                description: 'Show result starting from the nth page (default 1st page)',
                type: 3,
                required: false
            }
        ]
    },
    {
        name: 'create-event',
        description: 'Schedule a post to be sent in a specific channel',
        options: [
            {
                name: 'title',
                description: 'A title for the event',
                type: 3,
                required: true
            },
            {
                name: 'description',
                description: 'A description for the event',
                type: 3,
                required: true
            },
            {
                name: 'starttime',
                description:
                    'A time in the format YYYY-MM-DDTHH:MM:SS (example 2016-08-25T12:01:02)',
                type: 3,
                required: true
            },
            {
                name: 'endtime',
                description:
                    'A time in the format YYYY-MM-DDTHH:MM:SS (example 2016-08-25T12:01:02)',
                type: 3,
                required: true
            },
            {
                name: 'locationlink',
                description: 'A location link to the event location',
                type: 3,
                required: false
            },
            {
                name: 'imagelink',
                description: 'A link to a promotional image',
                type: 3,
                required: false
            },
            {
                name: 'online',
                description: 'A bool value for if event is online',
                type: 5,
                required: false
            },
            {
                name: 'featured',
                description: 'A bool value for if event is featured on front page',
                type: 5,
                required: false
            }
        ]
    },
    {
        name: 'remove-event',
        description: 'Remove an event based on an id',
        options: [
            {
                name: 'id',
                description: 'id of event to remove',
                type: 3,
                required: true
            }
        ]
    },
    {
        name: 'lookup-event',
        description: 'Get the full details of an event',
        options: [
            {
                name: 'id',
                description: 'id of event to lookup',
                type: 3,
                required: true
            }
        ]
    },
    {
        name: 'update-event',
        description: 'Schedule a post to be sent in a specific channel',
        options: [
            {
                name: 'id',
                description: 'id of event to modify',
                type: 3,
                required: true
            },
            {
                name: 'title',
                description: 'A title for the event',
                type: 3,
                required: false
            },
            {
                name: 'description',
                description: 'A description for the event',
                type: 3,
                required: false
            },
            {
                name: 'starttime',
                description:
                    'A time in the format YYYY-MM-DDTHH:MM:SS (example 2016-08-25T12:01:02)',
                type: 3,
                required: false
            },
            {
                name: 'endtime',
                description:
                    'A time in the format YYYY-MM-DDTHH:MM:SS (example 2016-08-25T12:01:02)',
                type: 3,
                required: false
            },
            {
                name: 'locationlink',
                description: 'A location link to the event location',
                type: 3,
                required: false
            },
            {
                name: 'imagelink',
                description: 'A link to a promotional image',
                type: 3,
                required: false
            },
            {
                name: 'online',
                description: 'A bool value for if event is online',
                type: 5,
                required: false
            },
            {
                name: 'featured',
                description: 'A bool value for if event is featured on front page',
                type: 5,
                required: false
            }
        ]
    }
];

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.on('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    try {
        console.log('Started refreshing application (/) commands.');

        if (CLIENT_ID) await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
});

// Takes all media input from head channel
client.on('messageCreate', async (message: Message): Promise<any> => {
    if (message.author.bot) return;
});

// commands used by users who want to follow or un-follow posts
client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.channel instanceof TextChannel) {
        if (interaction.commandName === 'post' && util.isAdmin(interaction)) {
            createPost(client, interaction as CommandInteraction);
        } else if (interaction.commandName.includes('event') && util.isAdmin(interaction)) {
            console.log('do event command');
        }
    }

    if (interaction.channel instanceof DMChannel) {
        // do DM channel functions
    }

    // non dm or channel specific commands go here:
    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
    if (interaction.commandName === 'about') {
        await interaction.reply(
            'I am a bot made for UNSW One Piece Society, Looking for new feature requests here: https://github.com/One-Piece-Society/OPBOT-2/issues ✨'
        );
    }
});

// Log in to Discord with your client's token
client.login(TOKEN);
