import type { Vente } from "../models/Vente";
import type {
  CreateVenteDTO,
  UpdateVenteDTO,
} from "../dto/vente.dto";

export interface VenteRepository {
  create(data: CreateVenteDTO): Promise<Vente>;
  getAll(): Promise<Vente[]>;
  getByWorkflow(workflowId: string): Promise<Vente[]>;
  update(id: string, data: UpdateVenteDTO): Promise<Vente>;
  delete(id: string): Promise<void>;
}
