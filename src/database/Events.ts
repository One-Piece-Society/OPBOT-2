import { type Event as EventType } from "@prisma/client";
import Database from "../utils/Database";

type newEventType = Omit<EventType, "id">;

export default class Events {
  private prisma = Database.getInstance().getPrismaClient();

  public createEvent = (data: newEventType): string => {
    console.log("Creating Event " + data.title);
    return data.title;
  };

  public updateEvent = (id: string) => {
    console.log("Updating Event of id " + id);
    return false;
  };

  public deleteEvent = (id: string) => {
    console.log("Deleting Event of id " + id);
    return false;
  };

  public getAllEvents = async () => {
    return await this.prisma.event.findMany();
  };
}
