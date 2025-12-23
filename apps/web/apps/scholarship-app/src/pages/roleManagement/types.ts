export interface Role {
  id: string;
  roleName: string;
  roleType: string;
  description?: string;
  status: "Active" | "Inactive";
  userType?: string;
  profilePhoto?: string;
  permissions?: RolePermission[];
}

export interface RolePermission {
  moduleName: string;
  create: boolean;
  update: boolean;
  view: boolean;
  delete: boolean;
}

export interface RoleFormData {
  roleName: string;
  userType: string;
  status: "Active" | "Inactive";
  profilePhoto?: File | string;
  permissions: RolePermission[];
}

export const MODULE_NAMES = [
  "Menu",
  "Overview",
  "Upload",
  "Suggest",
  "Approve",
  "Reports",
  "User Management",
  "Print Approval Form",
] as const;

export type ModuleName = typeof MODULE_NAMES[number];

