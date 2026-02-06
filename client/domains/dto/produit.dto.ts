import { z } from "zod";

export const CreateProduitSchema = z.object({
  workflowId: z.string(),
  nom: z.string().min(1),
  pu: z.number().positive(),
  reference: z.string().optional(),
  actif: z.boolean().optional(),
});

export type CreateProduitDTO = z.infer<typeof CreateProduitSchema>;
