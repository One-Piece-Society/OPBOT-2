import { EventPanel } from "@prisma/client";
import { prisma } from "../db";

export const updateEventPanel = async (
    data: Omit<EventPanel, "id">,
    eventId: string
) => {
    const event = await prisma.event
        .findFirst({ where: { id: eventId } })
        .catch((err) => {
            throw new Error(
                "Encountered Error while finding Event: " + err.message
            );
        });

    if (!event) throw new Error("No Event Found with id: " + eventId);

    const panel = await prisma.eventPanel.update({
        where: { position: data.position },
        data: { ...data, eventId: event.id },
    });

    return { data: panel };
};

export const getAllEventPanels = async () => {
    const panels = await prisma.eventPanel.findMany().catch((err) => {
        throw new Error(
            "Encountered error while getting all event panels " + err.message
        );
    });

    return { data: panels };
};

