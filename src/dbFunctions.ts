import {
  AttachmentBuilder,
  Client,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { parseAndCalculateDifference, parseMessage } from "./util";
import { supabase } from "./supaBaseClient";

export const createEvent = async (
  client: Client<boolean>,
  interaction: CommandInteraction
) => {
  // Validate data
  console.log(interaction.options.data);
  const title = interaction.options.data[0]["value"]?.toString();
  const desc = interaction.options.data[1]["value"]?.toString();
  const timeS = interaction.options.data[2]["value"]?.toString();
  const timeE = interaction.options.data[3]["value"]?.toString();

  if (!title || !desc || !timeS || !timeE) {
    return interaction.reply({
      content: "Invalid data strings",
      ephemeral: true,
    });
  }

  const startTime = Date.parse(timeS);
  if (isNaN(startTime)) {
    return interaction.reply({
      content:
        "Invalid Start Time: Check if start time is in the required format",
      ephemeral: true,
    });
  }

  const endTime = Date.parse(timeE);
  if (isNaN(endTime)) {
    return interaction.reply({
      content: "Invalid End Time: Check if End time is in the required format",
      ephemeral: true,
    });
  }

  // Validate valid time interval
  if (startTime > endTime) {
    return interaction.reply({
      content: "Invalid Times: Start Time must be before End Time",
      ephemeral: true,
    });
  }

  // Attempt insertion of data
  const { data, error } = await supabase
    .from("OPSOC-Website-Events")
    .insert({
      title: title,
      description: desc,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
    })
    .select();

  if (error) {
    return interaction.reply({
      content: "Invalid DB Insert: Error occurred with database",
      ephemeral: true,
    });
  } else {
    // return interaction.reply("createEvent - Not yet implemented");

    // create an embed object
    const embed = new EmbedBuilder()
      .setTitle("Success: Added event to database")
      .addFields({ name: "Title", value: "The value for the field" })
      .setColor(0x48be89);

    // send the embed to the same channel as the message
    await interaction.channel?.send({ embeds: [embed] });
  }
};

export const removeEvent = async (
  client: Client<boolean>,
  interaction: CommandInteraction
) => {
  return interaction.reply("removeEvent - Not yet implemented");
};

export const getEvents = async (
  client: Client<boolean>,
  interaction: CommandInteraction
) => {
  // let { data: OPSOC-Website-Events, error } = await supabase.from('OPSOC-Website-Events').select('*')

  const { data, error } = await supabase
    .from("OPSOC-Website-Events")
    .select("*");
  console.log("hi");
  console.log(data);
  console.log(error);

  return interaction.reply("getEvents - Not yet implemented");
};
