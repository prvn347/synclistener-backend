import z from "zod";
export type roomType = {
  title: string;
  roomKey: string;
  maxUsers: number;
};

export const roomInputSchema = z.object({
  title: z.string(),
  roomkey: z.number(),
  maxUser: z.number(),
});
