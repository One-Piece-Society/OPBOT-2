import { type Team as TeamType } from "@prisma/client";
import Database from "../utils/Database";

export default class Team {
  private prisma = Database.getInstance().getPrismaClient();

  public addTeamMember = (data: Omit<TeamType, "id">) => {
    console.log("Adding new team member " + data.name);
  };
  public getAllTeamMembers = async (year?: number) => {
    if (!year) return await this.prisma.team.findMany();

    return await this.prisma.team.findMany({
      where: {
        year,
      },
    });
  };
}
