import { z } from "zod";

export const CreateEmployeeSchema = z.object({
  workflowId: z.string(),
  matricule: z.string().min(1),
  nom: z.string().min(1),
  poste: z.string().optional(),
});

export type CreateEmployeeDTO = z.infer<typeof CreateEmployeeSchema>;

export const UpdateEmployeeSchema = z.object({
  matricule: z.string().optional(),
  nom: z.string().optional(),
  poste: z.string().optional(),
});

export type UpdateEmployeeDTO = z.infer<typeof UpdateEmployeeSchema>;
