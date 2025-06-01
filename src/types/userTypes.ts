
export type UserRole = 'operator' | 'engineer' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  department?: string;
  lastLogin?: Date;
}

export interface Permission {
  read: boolean;
  write: boolean;
  admin: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission> = {
  operator: { read: true, write: false, admin: false },
  engineer: { read: true, write: true, admin: false },
  admin: { read: true, write: true, admin: true }
};
