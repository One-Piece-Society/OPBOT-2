import { differenceInMinutes } from "date-fns";
import {
    AttachmentBuilder,
    CommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import { sleep } from "../functions/time";
import { parseMessage } from "../functions/message";

export const data = new SlashCommandBuilder()
    .setName("post")
    .setDescription("Schedule a post to be sent in a specific channel")
    .addStringOption((options) =>
        options
            .setName("url")
            .setDescription("Link of the Message you Wish to Post")
            .setRequired(true)
    )
    .addChannelOption((options) =>
        options
            .setName("channel")
            .setDescription("channel to post message in")
            .setRequired(true)
    )
    .addIntegerOption((options) =>
        options
            .setName("delay")
            .setDescription("how many minutes to post after")
            .setRequired(false)
    )
    .addStringOption((options) =>
        options
            .setName("datetime")
            .setDescription(
                "the date and time for the scheduled post in ISO Format"
            )
            .setRequired(false)
    )
    .setDMPermission(false);

export async function execute(interaction: CommandInteraction) {
    const url = interaction.options.get("url")?.value;
    const channel = interaction.options.get("channel");
    const delayStr = interaction.options.get("delay")?.value;
    const datetime = interaction.options.get("datetime")?.value;

    const msgID = url?.toString().match(/\d+/g)?.[2];

    if (typeof msgID === "undefined") {
        return interaction.reply({
            content:
                "Invalid Message URL: Please ensure you are in the same channel as the message you want to send",
            ephemeral: true,
        });
    }

    let msg;
    try {
        msg = await interaction.channel?.messages.fetch(msgID);
    } catch (e) {
        return interaction.reply({
            content:
                "Invalid Message URL: Check if URL is valid first, try running the command in the channel of the message you want to send",
            ephemeral: true,
        });
    }

    // Generate and get all attachments to send
    const attachments = msg?.attachments.map(
        (attachment) => new AttachmentBuilder(attachment.url)
    );

    // Get a list of all reactions used
    const reactions = msg?.reactions.cache;

    // Fetch ChannelID to send message
    const channelID = channel?.channel?.id;

    if (typeof channelID === "undefined") {
        return interaction.reply({
            content: "Invalid Channel ID: Check Bot has access to the channel",
            ephemeral: true,
        });
    }

    // Fetch Channel to send message
    const ch = interaction.guild?.channels.cache.get(channelID);

    if (!ch?.isTextBased()) {
        return interaction.reply({
            content: "Invalid Channel: Cannot send to VC",
            ephemeral: true,
        });
    }

    // Get delay value from args
    let delay: number;
    if (typeof delayStr === "undefined") {
        delay = 0;
    } else {
        delay = parseInt(delayStr.toString());
    }
    // get Date and Time from args

    if (typeof datetime === "string") {
        // if user provides datetime, use dateTime difference as delay instead

        const inputDate = new Date(datetime);
        const currentDate = new Date();
        if (inputDate <= currentDate) {
            delay = 0;
        } else {
            delay = differenceInMinutes(inputDate, currentDate);
        }
    }

    if (Number.isNaN(delay) || delay < 0) {
        return interaction.reply({
            content:
                "Invalid delay amount: Time must be a valid positive number",
            ephemeral: true,
        });
    }

    // Output message to be sent
    if (delay <= 0) {
        interaction.reply({
            content: "Message has been sent",
            ephemeral: true,
        });
    } else {
        interaction.reply({
            content: "Message will be sent in " + delay + " minutes",
            ephemeral: true,
        });
        sleep(delay * 60000);
    }

    const sentMsg = await ch.send({
        content: parseMessage(msg?.content),
        files: attachments,
    });

    // Add optional reactions (note reactions must be server specific)
    if (typeof reactions === "undefined") {
        return;
    }
    for (const react of reactions.keys()) {
        try {
            await sentMsg.react(react);
        } catch (error) {
            continue;
        }
    }
}

