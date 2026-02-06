import httpClient from "../api/httpClient";
import { endpointPerfoData } from "../api/endpoints";
import type { PerfoData } from "@/domains/models/PerfoData";
import type {
  CreatePerfoDataDTO,
  UpdatePerfoDataDTO,
} from "@/domains/dto/perfoData.dto";

export const PerfoDataRepoAPI = {
  async create(data: CreatePerfoDataDTO): Promise<PerfoData> {
    const res = await httpClient.post(
      endpointPerfoData.perfoData,
      data
    );
    return res.data;
  },

  async getAll(): Promise<PerfoData[]> {
    const res = await httpClient.get(
      endpointPerfoData.perfoData
    );
    return res.data;
  },

  async getByWorkflow(
    workflowId: string
  ): Promise<PerfoData[]> {
    const res = await httpClient.get(
      endpointPerfoData.byWorkflow(workflowId)
    );
    return res.data;
  },

  async update(
    id: string,
    data: UpdatePerfoDataDTO
  ): Promise<PerfoData> {
    const res = await httpClient.put(
      endpointPerfoData.perfo(id),
      data
    );
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(
      endpointPerfoData.perfo(id)
    );
  },
};
