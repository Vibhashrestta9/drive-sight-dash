
import { useState, useEffect } from 'react';
import { UserRole, User, ROLE_PERMISSIONS } from '@/types/userTypes';

// Mock current user - in real app this would come from authentication
const MOCK_CURRENT_USER: User = {
  id: '1',
  name: 'John Doe',
  role: 'engineer', // Change this to test different roles: 'operator', 'engineer', 'admin'
  email: 'john.doe@company.com',
  department: 'Operations',
  lastLogin: new Date()
};

export const useRoleAccess = () => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_CURRENT_USER);
  
  const permissions = ROLE_PERMISSIONS[currentUser.role];
  
  const canRead = () => permissions.read;
  const canWrite = () => permissions.write;
  const canAdmin = () => permissions.admin;
  
  const getRoleDisplayName = (role: UserRole): string => {
    const names = {
      operator: 'Operator',
      engineer: 'Engineer', 
      admin: 'Administrator'
    };
    return names[role];
  };
  
  const getRoleColor = (role: UserRole): string => {
    const colors = {
      operator: 'bg-blue-100 text-blue-800',
      engineer: 'bg-green-100 text-green-800',
      admin: 'bg-red-100 text-red-800'
    };
    return colors[role];
  };
  
  return {
    currentUser,
    setCurrentUser,
    canRead,
    canWrite,
    canAdmin,
    getRoleDisplayName,
    getRoleColor,
    permissions
  };
};
