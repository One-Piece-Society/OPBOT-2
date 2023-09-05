import { AttachmentBuilder, Client, CommandInteraction } from "discord.js";
import { parseAndCalculateDifference, parseMessage } from "./util";
import { supabase } from "./supaBaseClient";

export const createEvent = async (
  client: Client<boolean>,
  interaction: CommandInteraction
) => {
  // Validate data

  // Attempt insertion of data
  const { data, error } = await supabase
    .from("OPSOC-Website-Events")
    .insert({
      title: "testevent",
      description: "test event description",
      // startTime: ,
      // endTime: ,
      // createdAt: ,
      // updatedAt: ,
    })
    .select();
  console.log(data);
  console.log(error);

  return interaction.reply("createEvent - Not yet implemented");
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
