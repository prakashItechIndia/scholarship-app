export interface User {
  id: string;
  name: string;
  userRole: string;
  userType: "Administrator" | "Manager" | "Standard User";
  mobileNumber: string;
  emailId: string;
  status: "Active" | "Inactive";
  profilePhoto?: string;
}

export interface UserFormData {
  name: string;
  userRole: string;
  emailId: string;
  phoneNumber: string;
  status: "Active" | "Inactive";
  profilePhoto?: File | string;
}

export const USER_ROLES = [
  "CEO",
  "Super Admin",
  "Scholarship Processor",
  "Scholarship Admin",
  "Document Super Admin",
  "Document Admin",
  "Reception",
] as const;

export type UserRole = typeof USER_ROLES[number];

export const userRoleOptions = USER_ROLES.map((role) => ({
  value: role,
  label: role,
}));

