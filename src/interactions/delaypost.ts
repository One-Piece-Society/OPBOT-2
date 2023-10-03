import { differenceInMinutes } from "date-fns";
import {
    AttachmentBuilder,
    CommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import { sleep } from "../functions/time";
import { parseMessage } from "../functions/message";

export const data = new SlashCommandBuilder()
    .setName("delaypost")
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

    if (!msgID) {
        return await interaction.reply({
            content:
                "Invalid Message URL: Please ensure you are in the same channel as the message you want to send",
            ephemeral: true,
        });
    }

    const msg = await interaction.channel?.messages.fetch(msgID);

    if (!msg) {
        return await interaction.reply({
            content:
                "Invalid Message URL: Check if URL is valid first, try running the command in the channel of the message you want to send",
            ephemeral: true,
        });
    }

    // Generate and get all attachments to send
    const attachments = msg.attachments.map(
        (attachment) => new AttachmentBuilder(attachment.url)
    );

    // Get a list of all reactions used
    const reactions = msg.reactions.cache;

    // Fetch ChannelID to send message
    const channelID = channel?.channel?.id;

    if (!channelID) {
        return await interaction.reply({
            content: "Invalid Channel ID: Check Bot has access to the channel",
            ephemeral: true,
        });
    }

    // Fetch Channel to send message
    const sendChannel = interaction.guild?.channels.cache.get(channelID);

    if (!(sendChannel && sendChannel.isTextBased())) {
        return await interaction.reply({
            content: "Channel is invalid",
            ephemeral: true,
        });
    }

    // Get delay value from args
    let delay = 0;
    if (delayStr) {
        delay = parseInt(delayStr as string);
    }

    // if user provides datetime, use dateTime difference as delay instead
    if (datetime) {
        const inputDate = new Date(datetime as string);
        const currentDate = new Date();
        if (inputDate <= currentDate) {
            delay = 0;
        } else {
            delay = differenceInMinutes(inputDate, currentDate);
        }
    }

    if (delay < 0) {
        return await interaction.reply({
            content:
                "Invalid delay amount: Time must be a valid positive number",
            ephemeral: true,
        });
    }

    // Output message to be sent
    if (delay <= 0) {
        console.log("delay " + delay);
        return await interaction.reply({
            content: "Message has been sent",
            ephemeral: true,
        });
    } else {
        await interaction.reply({
            content: "Message will be sent in " + delay + " minutes",
            ephemeral: true,
        });
        await sleep(delay * 60000);
    }

    const sentMsg = await sendChannel.send({
        content: parseMessage(msg.content),
        files: attachments,
    });

    // Add optional reactions (note reactions must be server specific)
    if (typeof reactions === "undefined") return;
    for (const react of reactions.keys()) {
        await sentMsg.react(react).catch(() => {
            console.log("Encountered Error reacting to message");
        });
    }
}
