import * as ping from "../interactions/ping";
import * as about from "../interactions/about";
import * as delayPost from "../interactions/delaypost";
import * as getEvents from "../interactions/events-list";

/**
 * List of commands that are available as interactions in Discord
 */
export const userCommands = {
    ping,
    about,
};

export const adminCommands = {
    delayPost,
    getEvents,
};

export const commands = {
    ...userCommands,
    ...adminCommands,
};
