import httpClient from "../api/httpClient";
import { endpointWorkflow } from "../api/endpoints";
import type { Workflow } from "@/domains/models/Workflow";
import type { CreateWorkflowDTO } from "@/domains/dto/workflow.dto";

export const WorkflowRepoAPI = {
  async create(data: CreateWorkflowDTO): Promise<Workflow> {
    const res = await httpClient.post(endpointWorkflow.workflows, data);
    return res.data;
  },

  async getAll(): Promise<Workflow[]> {
    const res = await httpClient.get(endpointWorkflow.allWorkflows);
    return res.data;
  },

    async getByUser(): Promise<Workflow[]> {
    const res = await httpClient.get(endpointWorkflow.workflows);
    return res.data;
  },

  async getById(id: string): Promise<Workflow> {
    const res = await httpClient.get(endpointWorkflow.workflow(id));
    return res.data;
  },

  async update(
    id: string,
    data: Partial<Workflow>
  ): Promise<Workflow> {
    const res = await httpClient.put(endpointWorkflow.workflow(id), data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(endpointWorkflow.workflow(id));
  },
};
