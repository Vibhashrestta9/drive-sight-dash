
export interface Driver {
  id: number;
  name: string;
  status: 'active' | 'idle' | 'offline' | 'critical';
  location: string;
  lastUpdate: string;
  avatar: string;
  dhi?: number; // Drive Health Index
  dhiExplanation?: string; // Explanation of DHI score
  dhiTrend?: { change: number; direction: 'up' | 'down' | 'stable' }; // DHI trend information
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'idle':
      return 'bg-yellow-500';
    case 'offline':
      return 'bg-gray-500';
    case 'critical':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

/**
 * Get DHI status color class
 */
export const getDHIStatusColor = (dhiScore: number | undefined): string => {
  if (dhiScore === undefined) return 'bg-gray-500';
  
  if (dhiScore >= 90) return 'bg-green-500';
  if (dhiScore >= 75) return 'bg-emerald-500';
  if (dhiScore >= 60) return 'bg-yellow-500';
  if (dhiScore >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};

/**
 * Get DHI trend icon and color
 */
export const getDHITrendInfo = (trend?: { change: number; direction: 'up' | 'down' | 'stable' }) => {
  if (!trend) return { icon: '', colorClass: '' };
  
  let icon = '';
  let colorClass = '';
  
  switch (trend.direction) {
    case 'up':
      icon = '↑';
      colorClass = 'text-green-500';
      break;
    case 'down':
      icon = '↓';
      colorClass = 'text-red-500';
      break;
    case 'stable':
      icon = '→';
      colorClass = 'text-blue-500';
      break;
  }
  
  return { icon, colorClass };
};
