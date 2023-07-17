import { Client, CommandInteraction, Message, TextChannel } from "discord.js";

export const createPost = async (
  client: Client<boolean>,
  interaction: CommandInteraction
) => {
  // Get message id
  const url = interaction.options.data[0]["value"];
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
      content: "Invalid Message URL: Check if URL is valid first",
      ephemeral: true,
    });
  }

  // Return intended message
  return interaction.reply({ content: msg?.content });
};
