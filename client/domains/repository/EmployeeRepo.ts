import type { Employee } from "../models/Employee";
import type {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
} from "../dto/employee.dto";

export interface EmployeeRepository {
  create(data: CreateEmployeeDTO): Promise<Employee>;
  getAll(): Promise<Employee[]>;
  getByWorkflow(workflowId: string): Promise<Employee[]>;
  update(id: string, data: UpdateEmployeeDTO): Promise<Employee>;
  delete(id: string): Promise<void>;
}
