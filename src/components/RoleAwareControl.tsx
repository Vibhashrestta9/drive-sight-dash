
import React from 'react';
import { cn } from '@/lib/utils';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lock } from 'lucide-react';

interface RoleAwareControlProps {
  children: React.ReactNode;
  requiresWrite?: boolean;
  requiresAdmin?: boolean;
  className?: string;
  tooltip?: string;
}

const RoleAwareControl: React.FC<RoleAwareControlProps> = ({
  children,
  requiresWrite = false,
  requiresAdmin = false,
  className,
  tooltip
}) => {
  const { canWrite, canAdmin, currentUser, getRoleDisplayName } = useRoleAccess();
  
  const hasAccess = requiresAdmin ? canAdmin() : requiresWrite ? canWrite() : true;
  
  const defaultTooltip = requiresAdmin 
    ? `Administrator access required. Current role: ${getRoleDisplayName(currentUser.role)}`
    : requiresWrite 
    ? `Engineer access required. Current role: ${getRoleDisplayName(currentUser.role)}`
    : '';
  
  if (!hasAccess) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(
              "relative opacity-40 cursor-not-allowed select-none",
              className
            )}>
              {children}
              <div className="absolute inset-0 bg-gray-200/20 rounded pointer-events-none" />
              <Lock className="absolute top-1 right-1 h-3 w-3 text-gray-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip || defaultTooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return <div className={className}>{children}</div>;
};

export default RoleAwareControl;
