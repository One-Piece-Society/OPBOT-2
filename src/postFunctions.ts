import { Client, CommandInteraction, TextChannel } from "discord.js";

export const createPost = async (
  client: Client<boolean>,
  interaction: CommandInteraction
) => {
  // Get message id
  const url = interaction.options.data[0]["value"];
  const msgID = url?.toString().match(/\d+/g)?.[2];

  if (typeof msgID === "undefined") {
    throw new Error("ID for old offer is undefined");
  }

  const msg = await interaction.channel?.messages.fetch(msgID);

  // Return intended message
  return interaction.reply({ content: msg?.content });
};
