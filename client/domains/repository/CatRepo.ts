import type { Categorie } from "../models/Categorie";

export interface CategorieRepository {
  create(data: Omit<Categorie, "_id">): Promise<Categorie>;
  getAll(): Promise<Categorie[]>;
  getById(id: string): Promise<Categorie>;
  delete(id: string): Promise<void>;
}
