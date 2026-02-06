import { z } from "zod";
import { WorkflowSchema } from "./Workflow";
import { EmployeeSchema } from "./Employee";

export const PerfoDataSchema = z.object({
  _id: z.string(),

  score: z.number(),
  tache: z.string().optional(),
  periode: z.string(),

  workflowId: z.union([z.string(), WorkflowSchema]),
  employeeId: z.union([z.string(), EmployeeSchema]).optional(),

  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type PerfoData = z.infer<typeof PerfoDataSchema>;
