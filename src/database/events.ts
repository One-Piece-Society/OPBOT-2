import { Event } from "@prisma/client";
import { prisma } from "../db";

export const createEvent = async (data: Omit<Event, "id">) => {
    const event = await prisma.event
        .create({
            data,
        })
        .catch((err) => {
            throw new Error("encountered error creating event: " + err.message);
        });

    return { id: event.id };
};

export const updateEvent = async (id: string, newData: Omit<Event, "id">) => {
    const event = await prisma.event
        .update({ where: { id }, data: newData })
        .catch((err) => {
            throw new Error("encountered error updating event: " + err.message);
        });

    return { data: event };
};

export const getEvent = async (id: string) => {
    const event = await prisma.event
        .findFirst({
            where: { id },
        })
        .catch((err) => {
            throw new Error("encountered error getting event: " + err.message);
        });

    return { data: event };
};

export const getAllEvents = async () => {
    const events = await prisma.event.findMany().catch((err) => {
        throw new Error("encountered error getting events: " + err.message);
    });

    return { data: events };
};

