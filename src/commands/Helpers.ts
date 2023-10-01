/* eslint-disable @typescript-eslint/no-empty-function */
import {
  CacheType,
  ChatInputCommandInteraction,
  GuildMemberRoleManager,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { differenceInMinutes } from "date-fns";
import Env from "../env";

export default class Helpers {
  private ADMIN_ROLE_IDS = [""];

  public constructor() {
    const env = new Env().getEnv();
    this.ADMIN_ROLE_IDS = env.ADMIN_ROLE_IDS;
  }

  public isAdmin = (
    interaction:
      | ChatInputCommandInteraction<CacheType>
      | MessageContextMenuCommandInteraction<CacheType>
      | UserContextMenuCommandInteraction
  ) => {
    const adminCheck = (
      interaction.member?.roles as GuildMemberRoleManager
    ).cache.some((role) =>
      // id's for admins roles
      this.ADMIN_ROLE_IDS.includes(role.id)
    );

    if (!adminCheck) {
      interaction.reply("You must be an admin to use this command.");
    }
    return adminCheck;
  };

  // clean up temp messages and insert real pings
  public parseMessage = (message: string | undefined) => {
    if (!message) return "";
    message = message.replace("[EVERYONE]", "@everyone");
    return message;
  };

  public parseAndCalculateDifference = (dateTimeInput: number): number => {
    // HHmmDDMMYYYY  date format
    const dateTimeInputStr = dateTimeInput.toString();
    const hour = parseInt(dateTimeInputStr.slice(0, 2));
    const minute = parseInt(dateTimeInputStr.slice(2, 4));
    const day = parseInt(dateTimeInputStr.slice(4, 6));
    const month = parseInt(dateTimeInputStr.slice(6, 8)) - 1; // month is zero-based in JavaScript Date
    const year = parseInt(dateTimeInputStr.slice(8, 12));

    const inputDate = new Date(year, month, day, hour, minute);
    if (isNaN(inputDate.getTime())) {
      return 0; // Invalid date input
    }

    const currentDate = new Date();
    if (inputDate <= currentDate) {
      return 0; // Date is not in the future
    }

    const difference = differenceInMinutes(inputDate, currentDate);
    return difference;
  };

  public generateTextID = (): string => {
    return Math.floor(Math.random() * 1000000000)
      .toString()
      .padStart(10, "0");
  };
}
