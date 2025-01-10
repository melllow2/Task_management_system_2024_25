import { Role } from '../auth/role/role.enum'; 

export interface JwtPayload {
  username: string;
  role: Role;
}
