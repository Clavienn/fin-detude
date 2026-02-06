import httpClient from "../api/httpClient";
import { endpointUser } from "../api/endpoints";
import type { User } from "@/domains/models/User";
import type { RegisterUserDTO } from "@/domains/dto/user.dto";

export const UserRepoAPI = {
  async register(data: RegisterUserDTO): Promise<User> {
    const res = await httpClient.post(endpointUser.register, data);
    return res.data;
  },

  async login(email: string, password: string): Promise<{ token: string }> {
    const res = await httpClient.post(endpointUser.login, { email, password });
    return res.data;
  },

  async getAll(): Promise<User[]> {
    const res = await httpClient.get(endpointUser.users, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-datanova")}`,
        },
      });
    return res.data;
  },

  async getById(id: string): Promise<User> {
    const res = await httpClient.get(endpointUser.user(id));
    return res.data;
  },

  async update(id: string, user: Partial<User>): Promise<User> {
    const res = await httpClient.put(endpointUser.user(id), user);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(endpointUser.user(id));
  },
};
