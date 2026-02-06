import { z } from "zod";
import { WorkflowSchema } from "./Workflow";
import { UserSchema } from "./User";

export const ProduitSchema = z.object({
  _id: z.string(),
  nom: z.string(),
  pu: z.number(),
  reference: z.string().optional(),
  actif: z.boolean(),

  workflowId: z.union([z.string(), WorkflowSchema]),
  userId: z.union([z.string(), UserSchema]),

  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Produit = z.infer<typeof ProduitSchema>;
