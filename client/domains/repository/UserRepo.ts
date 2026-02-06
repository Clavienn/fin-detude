import type { User } from "../models/User";
import type { RegisterUserDTO } from "../dto/user.dto";

export interface UserRepository {
  register(data: RegisterUserDTO): Promise<User>;
  login(email: string, password: string): Promise<{ token: string }>;
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
