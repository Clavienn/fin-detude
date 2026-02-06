import { z } from "zod";


export const UserSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  tel: z.string(),
  role: z.string(),
});

export type User = z.infer<typeof UserSchema>;
