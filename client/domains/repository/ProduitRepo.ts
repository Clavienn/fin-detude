import type { Produit } from "../models/Produit";
import type { CreateProduitDTO } from "../dto/produit.dto";

export interface ProduitRepository {
  create(data: CreateProduitDTO): Promise<Produit>;
  importExcel(data: CreateProduitDTO): Promise<Produit>;
  getAll(): Promise<Produit[]>;
  getByWorkflow(workflowId: string): Promise<Produit[]>;
  update(id: string, data: Partial<Produit>): Promise<Produit>;
  delete(id: string): Promise<void>;
}
