import * as ping from "../interactions/ping";
import * as pong from "../interactions/pong";
import * as about from "../interactions/about";
import * as delaypost from "../interactions/delaypost";
import * as allevents from "../interactions/allevents";

/**
 * List of commands that are available as interactions in Discord
 * Command name should be the exact same as file name
 */
export const userCommands = {
    ping,
    about,
    pong,
};

export const adminCommands = {
    allevents,
    delaypost,
};

export const commands = {
    ...userCommands,
    ...adminCommands,
};
