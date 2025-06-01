
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Settings } from 'lucide-react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { UserRole } from '@/types/userTypes';

const UserRoleSelector: React.FC = () => {
  const { currentUser, setCurrentUser, getRoleDisplayName, getRoleColor } = useRoleAccess();
  
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentUser(prev => ({ ...prev, role: newRole }));
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Role-Based Access Control
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">{currentUser.name}</span>
            </div>
            <Badge className={getRoleColor(currentUser.role)}>
              {getRoleDisplayName(currentUser.role)}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <Select value={currentUser.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operator">Operator</SelectItem>
                <SelectItem value="engineer">Engineer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Permissions:</strong></p>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div className="text-center">
              <Badge variant="outline" className="bg-blue-50">Operator</Badge>
              <p className="text-xs mt-1">View Only</p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="bg-green-50">Engineer</Badge>
              <p className="text-xs mt-1">Modify Settings</p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="bg-red-50">Admin</Badge>
              <p className="text-xs mt-1">Full Access</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRoleSelector;
