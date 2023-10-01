import { PanelPosition } from "@prisma/client";
import { Database } from "src/utils/database";

export class EventPanels {
  private prisma = Database.getInstance().getPrismaClient();

  public updateEventPanel = (position: PanelPosition) => {
    console.log("updating event panel at " + position);
  };

  public getAllEventPanels = async () => {
    return await this.prisma.eventPanel.findMany();
  };
}
