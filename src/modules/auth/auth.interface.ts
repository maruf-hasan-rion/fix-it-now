import type { Role } from "../../../generated/prisma/enums";

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
}
