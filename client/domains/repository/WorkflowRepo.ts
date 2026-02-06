import { CreateWorkflowDTO } from "../dto/workflow.dto";
import type { Workflow } from "../models/Workflow";

export interface WorkflowRepository {
  create(data: CreateWorkflowDTO): Promise<Workflow>;
  getByUser(): Promise<Workflow[]>;
  getAll(): Promise<Workflow[]>;
  getById(id: string): Promise<Workflow>;
  update(id: string, data: Partial<Workflow>): Promise<Workflow>;
  delete(id: string): Promise<void>;
}
