import { Team } from "@prisma/client";
import { prisma } from "../db";

export const addTeamMember = async (data: Omit<Team, "id">) => {
    const team = await prisma.team
        .create({
            data,
        })
        .catch((err) => {
            throw new Error(
                "encountered error creating team member: " + err.message
            );
        });

    return { data: team };
};

export const removeTeamMember = async (id: string) => {
    await prisma.team.delete({ where: { id } }).catch((err) => {
        throw new Error(
            "encountered error deleting team member: " + err.message
        );
    });

    return true;
};

export const getAllTeamMembers = async (year?: number) => {
    const members = await prisma.team
        .findMany(
            year
                ? {
                      where: {
                          year,
                      },
                  }
                : undefined
        )
        .catch((err) => {
            throw new Error(
                "encountered error getting all team members: " + err.message
            );
        });

    return { data: members };
};
