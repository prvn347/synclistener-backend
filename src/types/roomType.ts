import z from "zod";
export type roomType = {
  title: string;
  maxUsers: number;
};

export const roomInputSchema = z.object({
  title: z.string(),
  maxUsers: z.number(),
});
