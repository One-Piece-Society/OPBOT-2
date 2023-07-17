import { AttachmentBuilder, Client, CommandInteraction } from "discord.js";

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

  // Generate and get all attachments to send
  const attachments = msg?.attachments.map(
    (attachment) => new AttachmentBuilder(attachment.url)
  );

  // Get a list of all reactions used
  const reactions = msg?.reactions.cache;

  // Fetch ChannelID to send message
  const channelID = interaction.options.get("channel")?.channel?.id;

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
  interaction.reply({
    content: "Message has been sent",
    ephemeral: true,
  });
  const sentMsg = await ch.send({ content: msg?.content, files: attachments });

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
};
