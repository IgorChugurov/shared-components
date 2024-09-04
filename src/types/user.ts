export interface IUser {
  id: string;

  name: string;
  email: string;
  role: { id: string; role: string };
  permissions: string[];
  token: string;
  refreshToken: string;
}
export interface IRole {
  id: string;
  role: string;
}
export enum RoleList {
  SuperAdmin = "SuperAdmin",
  Admin = "Admin",
  User = "User",
  Editor = "Editor",
}
