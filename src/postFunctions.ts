import { CommandInteraction, TextChannel } from "discord.js";

export const createPost = async (
  interaction: CommandInteraction & { channel: TextChannel }
) => {
  return interaction.reply("Basic unimplemented post feature");
};
