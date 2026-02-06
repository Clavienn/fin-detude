import type { PerfoData } from "../models/PerfoData";
import type {
  CreatePerfoDataDTO,
  UpdatePerfoDataDTO,
} from "../dto/perfoData.dto";

export interface PerfoDataRepository {
  create(data: CreatePerfoDataDTO): Promise<PerfoData>;
  getAll(): Promise<PerfoData[]>;
  getByWorkflow(workflowId: string): Promise<PerfoData[]>;
  update(id: string, data: UpdatePerfoDataDTO): Promise<PerfoData>;
  delete(id: string): Promise<void>;
}
