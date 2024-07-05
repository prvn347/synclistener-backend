import z from "zod";
export type roomType = {
  title: string;
  roomKey: string;
  maxUsers: number;
};

export type keyType = {
  roomKey: string;
};

export const roomInputSchema = z.object({
  title: z.string(),
  maxUsers: z.number(),
});
