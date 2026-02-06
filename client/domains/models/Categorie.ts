import { z } from "zod";

export const CategorieSchema = z.object({
  _id: z.string(),
  code: z.enum(["VENTE", "PERFO_EMP"]),
  description: z.string().optional(),
});

export type Categorie = z.infer<typeof CategorieSchema>;
