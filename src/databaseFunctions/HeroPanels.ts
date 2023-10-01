import { PanelPosition } from "@prisma/client";
import { Database } from "src/utils/database";

export class HeroPanel {
  private prisma = Database.getInstance().getPrismaClient();

  public updatePanelImage = async (
    position: PanelPosition,
    newImage: string
  ) => {
    console.log("Updating panel image at " + position);
    if (!newImage.includes("imgur")) return false;
    try {
      await this.prisma.imagePanel.update({
        where: {
          position,
        },
        data: {
          image: newImage,
        },
      });
    } catch (err) {
      return false;
    }
    return true;
  };

  public getAllHeroPanels = async () => {
    return await this.prisma.imagePanel.findMany();
  };
}
