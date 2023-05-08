import { Client, TextChannel } from "discord.js";
import cron from "node-cron";
import fs from "fs";

export const scheduleBirthdays = (client: Client) => {
  cron.schedule("0 0 * * *", () => {
    const characters = JSON.parse(
      fs.readFileSync("../../data/birthdays.json", "utf8")
    );
    const today = new Date();
    const todayString = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    for (const [name, birthDate] of Object.entries(characters)) {
      if (birthDate === todayString) {
        const channel = client.channels.cache.get("") as TextChannel;
        if (channel) {
          channel.send("Happy Birthday " + name + "! 🎉🎂🎁");
        }
      }
    }
  });
};
