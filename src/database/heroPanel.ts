import { ImagePanel } from "@prisma/client";
import { prisma } from "../db";

export const updatePanel = async (data: Omit<ImagePanel, "id">) => {
    const panel = await prisma.imagePanel
        .update({
            where: {
                position: data.position,
            },
            data,
        })
        .catch((err) => {
            throw new Error(
                "encountered error while updating panel: " + err.message
            );
        });

    return { data: panel };
};

export const getAllPanels = async () => {
    const panels = await prisma.imagePanel.findMany().catch((err) => {
        throw new Error(
            "encountered error while getting panels: " + err.message
        );
    });

    return { data: panels };
};

