import { Client, CommandInteraction, EmbedBuilder } from "discord.js";
import { supabase } from "./supaBaseClient";
import moment from "moment";
import { generateTextID } from "./util";

// Constant ENV var
const EVENT_TABLE = process.env?.EVENT_TABLE;
if (!EVENT_TABLE) throw new Error("Missing EVENT_TABLE environment variable.");

export const eventDirectory = async (
  client: Client<boolean>,
  interaction: CommandInteraction
) => {
  if (interaction.commandName === "create-event") {
    createEvent(client, interaction as CommandInteraction);
  } else if (interaction.commandName === "events") {
    getEvents(client, interaction as CommandInteraction);
  } else if (interaction.commandName === "remove-event") {
    removeEvent(client, interaction as CommandInteraction);
  } else if (interaction.commandName === "lookup-event") {
    detailEvent(client, interaction as CommandInteraction);
  } else if (interaction.commandName === "update-event") {
    updateEvent(client, interaction as CommandInteraction);
  }
};

export const createEvent = async (
  client: Client<boolean>,
  interaction: CommandInteraction
) => {
  // Validate data
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

  // Optionals variables
  const locationStr = interaction.options.get("locationlink")?.value;
  const imageStr = interaction.options.get("imagelink")?.value;
  const onlineVar = interaction.options.get("online")?.value;
  const featuredVar = interaction.options.get("featured")?.value;

  // Generate new id
  let newID;
  let size = 1;
  while (size != 0) {
    newID = generateTextID();
    const { data } = await supabase.from(EVENT_TABLE).select().eq("id", newID);
    size = data?.length ?? 1;
  }

  // Attempt insertion of data
  const { data, error } = await supabase
    .from(EVENT_TABLE)
    .insert({
      id: newID,
      title: title,
      description: desc,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      locationLink: locationStr,
      image: imageStr,
      online: onlineVar,
      updatedAt: new Date().toISOString(),
      featured: featuredVar,
    })
    .select();

  if (error) {
    return interaction.reply({
      content: "Invalid DB Insert: Error occurred with database",
      ephemeral: true,
    });
  } else {
    // create an embed object
    const embed = new EmbedBuilder()
      .setTitle("Success: Added event to database")
      .addFields(
        { name: "Title", value: data[0].title },
        { name: "Content Reference ID", value: data[0].id.toString() }
      )
      .setColor(0x48be89);

    // send the embed to the same channel as the message
    await interaction.reply({ embeds: [embed] });
  }
};

export const removeEvent = async (
  client: Client<boolean>,
  interaction: CommandInteraction
) => {
  // Validate id value
  const idStr = interaction.options.get("id")?.value;
  let id: number;
  if (typeof idStr === "undefined") {
    id = 1;
  } else {
    id = parseInt(idStr.toString());
  }

  // Validate data exists to be deleted
  const { data } = await supabase.from(EVENT_TABLE).select().eq("id", id);

  if (data?.length == 0) {
    return interaction.reply({
      content: "Event ID: " + idStr + " does not exist",
      ephemeral: true,
    });
  }

  // Delete data
  const { error } = await supabase.from(EVENT_TABLE).delete().eq("id", id);

  if (error) {
    return interaction.reply({
      content: "Invalid End Time: Check if End time is in the required format",
      ephemeral: true,
    });
  } else {
    const embed = new EmbedBuilder()
      .setTitle("Deletion is successful")
      .addFields({ name: "Event ID", value: id.toString() })
      .setColor(0xff0000);

    // send the embed to the same channel as the message
    await interaction.reply({ embeds: [embed] });
  }
};

export const getEvents = async (
  client: Client<boolean>,
  interaction: CommandInteraction
) => {
  // Validate page value
  const pageStr = interaction.options.get("page")?.value;
  let page: number;
  if (typeof pageStr === "undefined") {
    page = 1;
  } else {
    page = parseInt(pageStr.toString());
  }

  // Get page count
  const { count } = await supabase
    .from(EVENT_TABLE)
    .select("*", { count: "exact", head: true });

  // Validate var
  if (count === null) {
    return interaction.reply({
      content: "DB Error: Error occurred with database count",
      ephemeral: true,
    });
  } else if (Number.isNaN(page) || page <= 0) {
    return interaction.reply({
      content: "Page error: Page must be positive integer",
      ephemeral: true,
    });
  } else if (page > Math.ceil(count / 10)) {
    return interaction.reply({
      content:
        "Page out of range: Page in range 0 to " +
        Math.ceil(count / 10).toString(),
      ephemeral: true,
    });
  }

  // Fetch data from database
  const { data, error } = await supabase
    .from(EVENT_TABLE)
    .select("id,title")
    .range((page - 1) * 10, (page - 1) * 10 + 9);

  // Validates and return results
  if (error) {
    return interaction.reply({
      content: "DB Error: Error occurred with database fetch",
      ephemeral: true,
    });
  } else {
    // Constructs event list data
    const listEventStr = data
      .map((item) => "[ " + item.id + " ] - " + item.title)
      .join("\n");

    // create an embed object
    const embed = new EmbedBuilder()
      .setTitle(
        "Events data - Page (" +
          page.toString() +
          "/" +
          Math.ceil(count / 10).toString() +
          ")"
      )
      .addFields({ name: "[ ID ] | Event Title", value: listEventStr })
      .setColor(0x34e8eb);

    // send the embed to the same channel as the message
    await interaction.reply({ embeds: [embed] });
  }
};

export const detailEvent = async (
  client: Client<boolean>,
  interaction: CommandInteraction
) => {
  // Validate id value
  const idStr = interaction.options.get("id")?.value;
  let id: number;
  if (typeof idStr === "undefined") {
    id = 1;
  } else {
    id = parseInt(idStr.toString());
  }

  // Validate data exists to be searched
  const { data, error } = await supabase
    .from(EVENT_TABLE)
    .select()
    .eq("id", id);

  if (data?.length == 0) {
    return interaction.reply({
      content: "Event ID: " + idStr + " does not exist",
      ephemeral: true,
    });
  }

  // Return results
  if (error) {
    return interaction.reply({
      content: "Invalid End Time: Check if End time is in the required format",
      ephemeral: true,
    });
  } else {
    console.log(data[0]);
    const id = data[0].id.toString();
    const title = data[0].title.toString();
    const description = data[0].description.toString();
    const startTime = moment(data[0].startTime.toString()).format(
      "MMMM Do YYYY, h:mm a"
    );
    const endTime = moment(data[0].endTime.toString()).format(
      "MMMM Do YYYY, h:mm a"
    );
    const locationLink = data[0].locationLink
      ? data[0].locationLink.toString()
      : "None";
    const image = data[0].image ? data[0].image.toString() : "None";
    const createdAt = moment(data[0].createdAt.toString()).format(
      "MMMM Do YYYY, h:mm a"
    );
    const updatedAt = moment(data[0].updatedAt.toString()).format(
      "MMMM Do YYYY, h:mm a"
    );
    const postLink = data[0].postLink ? data[0].postLink.toString() : "None";

    // create an embed object
    const embed = new EmbedBuilder()
      .setTitle("Event info [" + id + "]")
      .addFields(
        { name: "Title", value: title },
        { name: "Description", value: description },
        { name: "Event Start Time", value: startTime },
        { name: "Event End Time", value: endTime },
        { name: "Location Link", value: locationLink },
        { name: "Image Link", value: image },
        { name: "Created Time", value: createdAt },
        { name: "Updated Time", value: updatedAt },
        { name: "Post Link", value: postLink }
      )
      .setColor(0xffb300);

    // send the embed to the same channel as the message
    await interaction.reply({ embeds: [embed] });
  }
};

export const updateEvent = async (
  client: Client<boolean>,
  interaction: CommandInteraction
) => {
  // Validate options correctness
  if (interaction.options.data.length == 1) {
    return interaction.reply({
      content:
        "Invalid Arguments: You must specify at least one optional argument",
      ephemeral: true,
    });
  }

  // Validate id value
  const idStr = interaction.options.get("id")?.value;
  let id: number;
  if (typeof idStr === "undefined") {
    id = 1;
  } else {
    id = parseInt(idStr.toString());
  }

  // Validate data exists to be searched
  const { data, error } = await supabase
    .from(EVENT_TABLE)
    .select()
    .eq("id", id);

  if (error) {
    return interaction.reply({
      content: "Invalid DB Lookup: Error occurred with database",
      ephemeral: true,
    });
  }

  if (data === null || data?.length == 0) {
    return interaction.reply({
      content: "Event ID: " + idStr + " does not exist",
      ephemeral: true,
    });
  }

  // Optionals variables
  const title = interaction.options.get("title")?.value
    ? interaction.options.get("title")?.value
    : data[0].title.toString();
  const description = interaction.options.get("description")?.value
    ? interaction.options.get("description")?.value
    : data[0].description.toString();

  // Check time validation
  const startTime = Date.parse(
    interaction.options.get("starttime")?.value
      ? interaction.options.get("starttime")?.value
      : data[0].startTime.toString()
  );
  if (isNaN(startTime)) {
    return interaction.reply({
      content:
        "Invalid Start Time: Check if start time is in the required format",
      ephemeral: true,
    });
  }

  const endTime = Date.parse(
    interaction.options.get("endtime")?.value
      ? interaction.options.get("endtime")?.value
      : data[0].endTime.toString()
  );
  if (isNaN(endTime)) {
    return interaction.reply({
      content: "Invalid End Time: Check if End time is in the required format",
      ephemeral: true,
    });
  }

  // Check optional value inputs
  const locationStr = interaction.options.get("locationlink")?.value
    ? interaction.options.get("locationlink")?.value
    : data[0].locationLink
    ? data[0].locationLink.toString()
    : interaction.options.get("locationlink")?.value;

  const imageStr = interaction.options.get("imagelink")?.value
    ? interaction.options.get("imagelink")?.value
    : data[0].image
    ? data[0].image.toString()
    : interaction.options.get("imagelink")?.value;

  const postStr = interaction.options.get("postlink")?.value
    ? interaction.options.get("postlink")?.value
    : data[0].postLink
    ? data[0].postLink.toString()
    : interaction.options.get("postlink")?.value;

  // Attempt updating data
  const res = await supabase
    .from(EVENT_TABLE)
    .update({
      title: title,
      description: description,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      locationLink: locationStr,
      image: imageStr,
      postLink: postStr,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .select();

  // output results
  if (res.error != null) {
    return interaction.reply({
      content: "Invalid DB update: Error occurred with database",
      ephemeral: true,
    });
  } else {
    return interaction.reply({
      content: "Successful updated entry",
      ephemeral: true,
    });
  }
};
