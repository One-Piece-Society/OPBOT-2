import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getAllEvents } from "../database/events";
import { websiteURL } from "../constants";

export const data = new SlashCommandBuilder()
    .setName("allevents")
    .setDescription("returns a list of all events");

export async function execute(interaction: CommandInteraction) {
    const response = await getAllEvents();

    const cleanedResponse: { title: string; link: string; id: string }[] = [];
    response.data.forEach((event: { title: string; id: string }) => {
        cleanedResponse.push({
            title: event.title,
            link: websiteURL + "?event=" + event.id,
            id: event.id,
        });
    });

    let reply = "";
    cleanedResponse.forEach((event) => {
        reply = reply.concat(
            `**${event.title}:**\n**event id: **${event.id}\n${event.link}\n\n`
        );
    });
    return interaction.reply({
        content: `Here are all the One Piece Society Events:\n\n\n${reply}`,
        embeds: [],
    });
}
