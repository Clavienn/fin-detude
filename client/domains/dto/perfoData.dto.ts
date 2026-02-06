import { z } from "zod";

export const CreatePerfoDataSchema = z.object({
  workflowId: z.string(),
  employeeId: z.string().optional(),
  score: z.number(),
  tache: z.string().optional(),
  periode: z.string().min(1),
});

export type CreatePerfoDataDTO = z.infer<typeof CreatePerfoDataSchema>;

export const UpdatePerfoDataSchema = z.object({
  score: z.number().optional(),
  tache: z.string().optional(),
  periode: z.string().optional(),
  employeeId: z.string().optional(),
});

export type UpdatePerfoDataDTO = z.infer<typeof UpdatePerfoDataSchema>;
