import httpClient from "../api/httpClient";
import { endpointVente } from "../api/endpoints";
import type { Vente } from "@/domains/models/Vente";
import type {
  CreateVenteDTO,
  UpdateVenteDTO,
} from "@/domains/dto/vente.dto";

export const VenteRepoAPI = {
  async create(data: CreateVenteDTO): Promise<Vente> {
    const res = await httpClient.post(endpointVente.ventes, data);
    return res.data;
  },

  async getAll(): Promise<Vente[]> {
    const res = await httpClient.get(endpointVente.ventes);
    return res.data;
  },

  async getByWorkflow(workflowId: string): Promise<Vente[]> {
    const res = await httpClient.get(
      endpointVente.byWorkflow(workflowId)
    );
    return res.data;
  },

  async update(
    id: string,
    data: UpdateVenteDTO
  ): Promise<Vente> {
    const res = await httpClient.put(
      endpointVente.vente(id),
      data
    );
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(endpointVente.vente(id));
  },
};
