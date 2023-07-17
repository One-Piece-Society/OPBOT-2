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

  // Fetch message
  let msg;
  try {
    msg = await interaction.channel?.messages.fetch(msgID);
  } catch (e) {
    return interaction.reply({
      content: "Invalid Message URL: Check if URL is valid first",
      ephemeral: true,
    });
  }

  // Fetch ChannelID to send message
  const channelID = interaction.options.get("channel")?.channel?.id;
  console.log(channelID);

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

  // Output message to be sent
  return ch.send({ content: msg?.content });
};
