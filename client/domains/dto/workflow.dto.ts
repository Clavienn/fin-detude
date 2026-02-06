import { z } from "zod";

export const CreateWorkflowSchema = z.object({
  categorieId: z.string(),
  nom: z.string().min(1),
  description: z.string().optional(),
  actif: z.boolean()
});

export type CreateWorkflowDTO = z.infer<typeof CreateWorkflowSchema>;
