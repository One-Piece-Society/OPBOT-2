import {
  CacheType,
  ChatInputCommandInteraction,
  GuildMemberRoleManager,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";

export const isAdmin = (
  interaction:
    | ChatInputCommandInteraction<CacheType>
    | MessageContextMenuCommandInteraction<CacheType>
    | UserContextMenuCommandInteraction
) => {
  const adminCheck = (
    interaction.member?.roles as GuildMemberRoleManager
  ).cache.some(
    (role) =>
      // id's for admins roles
      role.id === "949689658789490688" || role.id === "1000265498639994951"
  );

  if (!adminCheck) {
    interaction.reply("You must be an admin to use this command.");
  }
  return adminCheck;
};
