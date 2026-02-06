import httpClient from "../api/httpClient";
import httpClientFastAPI from "../api/httpClientFastAPI";

import { endpointProduit } from "../api/endpoints";
import type { Produit } from "@/domains/models/Produit";
import type { CreateProduitDTO } from "@/domains/dto/produit.dto";

export const ProduitRepoAPI = {
  async create(data: CreateProduitDTO): Promise<Produit> {
    const res = await httpClient.post(endpointProduit.produits, data);
    return res.data;
  },
  async importExcel(data: CreateProduitDTO): Promise<Produit> {
    const res = await httpClientFastAPI.post(endpointProduit.Excel, data);
    return res.data;
  },

  async getAll(): Promise<Produit[]> {
    const res = await httpClient.get(endpointProduit.produits);
    return res.data;
  },

  async getByWorkflow(workflowId: string): Promise<Produit[]> {
    const res = await httpClient.get(
      endpointProduit.byWorkflow(workflowId)
    );
    return res.data;
  },

  async update(
    id: string,
    data: Partial<Produit>
  ): Promise<Produit> {
    const res = await httpClient.put(
      endpointProduit.produit(id),
      data
    );
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(endpointProduit.produit(id));
  },
};
