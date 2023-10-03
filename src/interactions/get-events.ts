import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getAllEvents } from "../database/events";
import { websiteURL } from "../constants";

export const data = new SlashCommandBuilder()
    .setName("get-events")
    .setDescription("returns a list of all events");

export async function execute(interaction: CommandInteraction) {
    const events = await getAllEvents();
    const cleanedResponse: { title: string; link: string }[] = [];

    events.data.forEach((event) => {
        cleanedResponse.push({
            title: event.title,
            link: websiteURL + "?eventId=" + event.id,
        });
    });

    let reply = "";
    cleanedResponse.forEach((event) => {
        reply = reply.concat(`**${event.title}:\n**${event.link}\n\n`);
    });

    return interaction.reply(reply);
}
