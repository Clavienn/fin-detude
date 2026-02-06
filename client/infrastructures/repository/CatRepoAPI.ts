import httpClient from "../api/httpClient";
import { endpointCategorie } from "../api/endpoints";
import type { Categorie } from "@/domains/models/Categorie";

export const CategorieRepoAPI = {
  async create(data: Omit<Categorie, "_id">): Promise<Categorie> {
    const res = await httpClient.post(endpointCategorie.categories, data);
    return res.data;
  },

  async getAll(): Promise<Categorie[]> {
    const res = await httpClient.get(endpointCategorie.categories);
    return res.data;
  },

  async getById(id: string): Promise<Categorie> {
    const res = await httpClient.get(endpointCategorie.category(id));
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(endpointCategorie.category(id));
  },
};
