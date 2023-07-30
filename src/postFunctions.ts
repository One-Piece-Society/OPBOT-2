import { AttachmentBuilder, Client, CommandInteraction } from "discord.js";

const sleep = (ms: number | undefined) => new Promise((r) => setTimeout(r, ms));

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

  // Get delay value from args
  const delayStr = interaction.options.get("delay")?.value;
  let delay: number;
  if (typeof delayStr === "undefined") {
    delay = 0;
  } else {
    delay = parseInt(delayStr.toString());
  }

  if (Number.isNaN(delay) || delay < 0) {
    return interaction.reply({
      content: "Invalid delay amount: Time must be a valid positive number",
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
    await sleep(delay * 60000);
  }

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
