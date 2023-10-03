import {
    ChatInputCommandInteraction,
    CacheType,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
    GuildMemberRoleManager,
} from "discord.js";
import { config } from "../config";

export const isAdmin = (
    interaction:
        | ChatInputCommandInteraction<CacheType>
        | MessageContextMenuCommandInteraction<CacheType>
        | UserContextMenuCommandInteraction
) => {
    const adminCheck = (
        interaction.member?.roles as GuildMemberRoleManager
    ).cache.some((role) =>
        // id's for admins roles
        config.ADMIN_ROLE_IDS.includes(role.id)
    );

    if (!adminCheck) {
        interaction.reply("You must be an admin to use this command.");
    }
    return adminCheck;
};
