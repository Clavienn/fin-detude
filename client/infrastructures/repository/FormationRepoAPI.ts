import httpClient from "../api/httpClient";
import { endpointFormation } from "../api/endpoints";
import type {
  Formation,
  FormationAnalyse,
  FormationPrediction,
} from "@/domains/models/Formation";

export const FormationRepoAPI = {
  /* CRUD */
  async create(data: Omit<Formation, "_id">): Promise<Formation> {
    const res = await httpClient.post(endpointFormation.formations, data);
    return res.data;
  },

  async update(
    id: string,
    data: Partial<Omit<Formation, "_id">>
  ): Promise<Formation> {
    const res = await httpClient.put(
      `${endpointFormation.formations}/${id}`,
      data
    );
    return res.data;
  },

  async getAll(): Promise<Formation[]> {
    const res = await httpClient.get(endpointFormation.formations);
    return res.data;
  },

  /* ===== DATANOVA ===== */

  async analyse(): Promise<FormationAnalyse> {
    const res = await httpClient.get(endpointFormation.analyse);
    return res.data;
  },

  async predictParticipation(): Promise<FormationPrediction> {
    const res = await httpClient.get(
      endpointFormation.predictionParticipation
    );
    return res.data;
  },
};
