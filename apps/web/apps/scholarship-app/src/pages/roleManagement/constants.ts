import { Role, RolePermission, MODULE_NAMES } from "./types";

// Mock data for roles
export const mockRoles: Role[] = [
  {
    id: "1",
    roleName: "Super Admin_TFS",
    roleType: "superadmin",
    description: "Super administrator with full access",
    status: "Active",
    userType: "Administrator",
    permissions: MODULE_NAMES.map((module) => ({
      moduleName: module,
      create: true,
      update: true,
      view: true,
      delete: true,
    })),
  },
  {
    id: "2",
    roleName: "manager_Scholarship Admin",
    roleType: "manager",
    description: "Manager role for scholarship administration",
    status: "Active",
    userType: "Manager",
    permissions: MODULE_NAMES.map((module) => ({
      moduleName: module,
      create: true,
      update: true,
      view: true,
      delete: false,
    })),
  },
  {
    id: "3",
    roleName: "Super Admin",
    roleType: "superadmin",
    description: "Super administrator role",
    status: "Active",
    userType: "Administrator",
    permissions: MODULE_NAMES.map((module) => ({
      moduleName: module,
      create: true,
      update: true,
      view: true,
      delete: true,
    })),
  },
  {
    id: "4",
    roleName: "Standard User_Reception",
    roleType: "standard user",
    description: "Standard user role for reception",
    status: "Inactive",
    userType: "User",
    permissions: MODULE_NAMES.map((module) => ({
      moduleName: module,
      create: false,
      update: false,
      view: true,
      delete: false,
    })),
  },
];

export const userTypeOptions = [
  { value: "Administrator", label: "Administrator" },
  { value: "Manager", label: "Manager" },
  { value: "Standard User", label: "Standard User" },
];

export const defaultPermissions: RolePermission[] = MODULE_NAMES.map((module) => ({
  moduleName: module,
  create: false,
  update: false,
  view: false,
  delete: false,
}));

