import { z } from "zod";

export const RegisterUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  tel: z.string().min(3),
  password: z.string().min(6),
});

export type RegisterUserDTO = z.infer<typeof RegisterUserSchema>;

export interface LoginDTO {
  email: string;
  password: string;
}
