import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export default class Database {
  private static instance: Database | null = null;
  private prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getPrismaClient(): PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    DefaultArgs
  > {
    return this.prisma;
  }
}
