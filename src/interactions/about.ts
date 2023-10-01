import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("about")
  .setDescription("Replies with Info about the Bot");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply(
    "One Piece Society's very own team helper and website management bot 🚀"
  );
}
