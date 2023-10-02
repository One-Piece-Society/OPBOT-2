import * as ping from "../interactions/ping";
import * as about from "../interactions/about";
import * as delaypost from "../interactions/delaypost";

/**
 * List of commands that are available as interactions in Discord
 */
export const userCommands = {
    ping,
    about,
};

export const adminCommands = {
    delaypost,
};

export const commands = {
    ...userCommands,
    ...adminCommands,
};
