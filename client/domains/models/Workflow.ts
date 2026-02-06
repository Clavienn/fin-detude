import { z } from "zod";
import { CategorieSchema } from "./Categorie";
import { UserSchema } from "./User";

export const WorkflowSchema = z.object({
  _id: z.string(),
  nom: z.string(),
  description: z.string().optional(),
  actif: z.boolean(),

  // population backend
  categorieId: z.union([z.string(), CategorieSchema]),
  userId: z.union([z.string(), UserSchema]),

  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Workflow = z.infer<typeof WorkflowSchema>;
