import { AttachmentBuilder, Client, CommandInteraction } from "discord.js";
import { parseAndCalculateDifference, parseMessage } from "./util";
import { supabase } from "./supaBaseClient";

export const createEvent = async (
  client: Client<boolean>,
  interaction: CommandInteraction
) => {
  return;
};

export const removeEvent = async (
  client: Client<boolean>,
  interaction: CommandInteraction
) => {
  return;
};

export const getEvents = async (
  client: Client<boolean>,
  interaction: CommandInteraction
) => {
  // let { data: OPSOC-Website-Events, error } = await supabase.from('OPSOC-Website-Events').select('*')

  const { data, error } = await supabase.from("OPSOC-Website-Events").select();
  console.log("hi");
  console.log(data);

  return;
};
