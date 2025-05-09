
import { useState, useEffect } from 'react';

type SyncStatus = 'waiting' | 'in_progress' | 'completed' | 'failed';
type ModelStatus = 'online' | 'degraded' | 'offline';

export function useDigitalTwin() {
  const [edgeStatus, setEdgeStatus] = useState<ModelStatus>('online');
  const [cloudStatus, setCloudStatus] = useState<ModelStatus>('online');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('completed');
  const [syncProgress, setSyncProgress] = useState(100);
  const [syncHealth, setSyncHealth] = useState(97);
  const [lastSyncTime, setLastSyncTime] = useState('2 mins ago');
  const [isInitialized, setIsInitialized] = useState(false);

  // Simulate periodic sync behaviors
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }

    // Random sync event simulation (every 20-40 seconds)
    const syncInterval = setInterval(() => {
      // 10% chance of having sync issues
      const hasIssue = Math.random() < 0.1;
      
      if (hasIssue) {
        const issueType = Math.random();
        
        if (issueType < 0.3) {
          // Edge degradation
          setEdgeStatus('degraded');
          setSyncHealth(prev => Math.max(prev - Math.floor(Math.random() * 15), 50));
        } else if (issueType < 0.6) {
          // Cloud degradation
          setCloudStatus('degraded');
          setSyncHealth(prev => Math.max(prev - Math.floor(Math.random() * 15), 60));
        } else {
          // Sync failure
          setSyncStatus('failed');
          setSyncProgress(Math.floor(Math.random() * 80));
          setSyncHealth(prev => Math.max(prev - Math.floor(Math.random() * 20), 40));
        }
      } else {
        // Start a normal sync
        startSync();
      }
    }, Math.random() * 20000 + 20000); // Random interval between 20-40 seconds

    return () => clearInterval(syncInterval);
  }, [isInitialized]);

  // Simulate a sync operation
  const startSync = () => {
    setSyncStatus('in_progress');
    setSyncProgress(0);
    setLastSyncTime('in progress');
    
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        completeSyncProcess();
      }
      setSyncProgress(progress);
    }, 300);
  };

  const completeSyncProcess = () => {
    // 95% chance of successful sync
    const isSuccessful = Math.random() < 0.95;
    
    if (isSuccessful) {
      setSyncStatus('completed');
      setEdgeStatus('online');
      setCloudStatus('online');
      setLastSyncTime('just now');
      
      // Improve health slightly if it was not perfect
      if (syncHealth < 100) {
        setSyncHealth(prev => Math.min(prev + Math.floor(Math.random() * 5), 100));
      }
      
      // Update last sync time text after a delay
      setTimeout(() => {
        setLastSyncTime('1 min ago');
      }, 60000);
    } else {
      // Failed sync
      setSyncStatus('failed');
      setSyncHealth(prev => Math.max(prev - Math.floor(Math.random() * 15), 30));
    }
  };

  // Expose function to manually trigger a sync
  const triggerSync = () => {
    if (syncStatus !== 'in_progress') {
      startSync();
    }
    return;
  };

  const resetTwin = () => {
    setEdgeStatus('online');
    setCloudStatus('online');
    setSyncStatus('completed');
    setSyncProgress(100);
    setSyncHealth(97);
    setLastSyncTime('just now');
  };

  return {
    edgeStatus,
    cloudStatus,
    syncStatus,
    syncProgress,
    lastSyncTime,
    syncHealth,
    triggerSync,
    resetTwin
  };
}
