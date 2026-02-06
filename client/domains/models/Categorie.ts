import { z } from "zod";

export const CategorieSchema = z.object({
  _id: z.string(),
  code: z.enum(["VENTE", "PERFO_EMP","FORMATION"]),
  description: z.string().optional(),
});

export type Categorie = z.infer<typeof CategorieSchema>;
