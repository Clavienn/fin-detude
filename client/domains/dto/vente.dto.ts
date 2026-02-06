import { z } from "zod";

export const CreateVenteSchema = z.object({
  workflowId: z.string(),
  produitId: z.string().optional(),
  qte: z.number().positive(),
});

export type CreateVenteDTO = z.infer<typeof CreateVenteSchema>;

export const UpdateVenteSchema = z.object({
  qte: z.number().positive().optional(),
  produitId: z.string().optional(),
});

export type UpdateVenteDTO = z.infer<typeof UpdateVenteSchema>;
