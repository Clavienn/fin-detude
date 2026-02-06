import { z } from "zod";
import { WorkflowSchema } from "./Workflow";
import { UserSchema } from "./User";

export const EmployeeSchema = z.object({
  _id: z.string(),

  matricule: z.string(),
  nom: z.string(),
  poste: z.string().optional(),

  workflowId: z.union([z.string(), WorkflowSchema]),
  userId: z.union([z.string(), UserSchema]),

  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Employee = z.infer<typeof EmployeeSchema>;
