import httpClient from "../api/httpClient";
import { endpointEmployee } from "../api/endpoints";
import type { Employee } from "@/domains/models/Employee";
import type {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
} from "@/domains/dto/employee.dto";

export const EmployeeRepoAPI = {
  async create(data: CreateEmployeeDTO): Promise<Employee> {
    const res = await httpClient.post(endpointEmployee.employees, data);
    return res.data;
  },

  async getAll(): Promise<Employee[]> {
    const res = await httpClient.get(endpointEmployee.employees);
    return res.data;
  },

  async getByWorkflow(workflowId: string): Promise<Employee[]> {
    const res = await httpClient.get(
      endpointEmployee.byWorkflow(workflowId)
    );
    return res.data;
  },

  async update(
    id: string,
    data: UpdateEmployeeDTO
  ): Promise<Employee> {
    const res = await httpClient.put(
      endpointEmployee.employee(id),
      data
    );
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(endpointEmployee.employee(id));
  },
};
