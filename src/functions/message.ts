// clean up temp messages and insert real pings
export const parseMessage = (message: string | undefined) => {
    if (!message) return "";
    message = message.replace("[EVERYONE]", "@everyone");
    return message;
};
