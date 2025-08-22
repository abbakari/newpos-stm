import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { UserRole } from '@shared/types';

// Technician status types
export type TechnicianWorkStatus = 'available' | 'busy' | 'break' | 'offline';

export interface TechnicianStatus {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  lastSeen: Date;
  currentStatus: TechnicianWorkStatus;
  currentJobId?: string;
  currentJobTitle?: string;
  skillset: string[];
  completedJobsToday: number;
  hoursWorkedToday: number;
  efficiency: number;
  location?: string;
  notes?: string;
}

interface TechnicianStatusContextType {
  technicians: TechnicianStatus[];
  currentUserStatus: TechnicianStatus | null;
  updateStatus: (status: TechnicianWorkStatus, notes?: string) => void;
  setCurrentJob: (jobId: string, jobTitle: string) => void;
  clearCurrentJob: () => void;
  markActive: () => void;
  markOffline: () => void;
  sendHeartbeat: () => void;
  getActiveTechnicians: () => TechnicianStatus[];
  getAvailableTechnicians: () => TechnicianStatus[];
  getTechnicianById: (id: string) => TechnicianStatus | undefined;
}

const TechnicianStatusContext = createContext<TechnicianStatusContextType | undefined>(undefined);

// Mock initial technician data
const initialTechnicians: TechnicianStatus[] = [
  {
    id: 'tech-1',
    name: 'Mike Johnson',
    email: 'mike@company.com',
    phone: '+1234567892',
    isActive: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    currentStatus: 'offline',
    skillset: ['Engine Repair', 'Oil Changes', 'Brake Service'],
    completedJobsToday: 0,
    hoursWorkedToday: 0,
    efficiency: 95,
  },
  {
    id: 'tech-2',
    name: 'Sarah Wilson',
    email: 'sarah@company.com',
    phone: '+1234567893',
    isActive: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    currentStatus: 'offline',
    skillset: ['Tire Service', 'Brake Repair', 'Diagnostics'],
    completedJobsToday: 0,
    hoursWorkedToday: 0,
    efficiency: 88,
  },
  {
    id: 'tech-3',
    name: 'Tom Brown',
    email: 'tom@company.com',
    phone: '+1234567894',
    isActive: false,
    lastSeen: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    currentStatus: 'offline',
    skillset: ['Engine Diagnostics', 'Electrical', 'AC Service'],
    completedJobsToday: 0,
    hoursWorkedToday: 0,
    efficiency: 92,
  },
];

export const TechnicianStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [technicians, setTechnicians] = useState<TechnicianStatus[]>(initialTechnicians);

  // Get current user's technician status
  const currentUserStatus = user?.role === UserRole.TECHNICIAN 
    ? technicians.find(tech => tech.id === user.id) || null 
    : null;

  // Auto-mark technician as active when they log in
  useEffect(() => {
    if (user?.role === UserRole.TECHNICIAN) {
      markActive();
    }
  }, [user]);

  // Heartbeat to keep status updated
  useEffect(() => {
    if (user?.role === UserRole.TECHNICIAN) {
      const interval = setInterval(sendHeartbeat, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  // Auto-detect idle/offline status
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    let offlineTimer: NodeJS.Timeout;

    const resetTimers = () => {
      clearTimeout(idleTimer);
      clearTimeout(offlineTimer);
      
      if (user?.role === UserRole.TECHNICIAN && currentUserStatus?.isActive) {
        // Mark as break after 15 minutes of inactivity
        idleTimer = setTimeout(() => {
          updateStatus('break', 'Auto-marked as on break due to inactivity');
        }, 15 * 60 * 1000);

        // Mark as offline after 1 hour of inactivity
        offlineTimer = setTimeout(() => {
          markOffline();
        }, 60 * 60 * 1000);
      }
    };

    // Reset timers on user activity
    const handleActivity = () => {
      if (user?.role === UserRole.TECHNICIAN && currentUserStatus?.isActive) {
        sendHeartbeat();
        resetTimers();
      }
    };

    // Listen for user activity
    document.addEventListener('mousedown', handleActivity);
    document.addEventListener('keydown', handleActivity);
    document.addEventListener('scroll', handleActivity);
    
    resetTimers();

    return () => {
      clearTimeout(idleTimer);
      clearTimeout(offlineTimer);
      document.removeEventListener('mousedown', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('scroll', handleActivity);
    };
  }, [user, currentUserStatus?.isActive]);

  const updateTechnicianStatus = (
    technicianId: string, 
    updates: Partial<TechnicianStatus>
  ) => {
    setTechnicians(prev => 
      prev.map(tech => 
        tech.id === technicianId 
          ? { ...tech, ...updates, lastSeen: new Date() }
          : tech
      )
    );
  };

  const updateStatus = (status: TechnicianWorkStatus, notes?: string) => {
    if (!user || user.role !== UserRole.TECHNICIAN) return;

    updateTechnicianStatus(user.id, {
      currentStatus: status,
      notes,
      isActive: status !== 'offline',
    });

    // In real app, this would send to API
    console.log(`Technician ${user.name} status updated to: ${status}`, notes);
  };

  const setCurrentJob = (jobId: string, jobTitle: string) => {
    if (!user || user.role !== UserRole.TECHNICIAN) return;

    updateTechnicianStatus(user.id, {
      currentJobId: jobId,
      currentJobTitle: jobTitle,
      currentStatus: 'busy',
    });
  };

  const clearCurrentJob = () => {
    if (!user || user.role !== UserRole.TECHNICIAN) return;

    updateTechnicianStatus(user.id, {
      currentJobId: undefined,
      currentJobTitle: undefined,
      currentStatus: 'available',
    });
  };

  const markActive = () => {
    if (!user || user.role !== UserRole.TECHNICIAN) return;

    updateTechnicianStatus(user.id, {
      isActive: true,
      currentStatus: 'available',
      lastSeen: new Date(),
    });

    console.log(`Technician ${user.name} marked as active`);
  };

  const markOffline = () => {
    if (!user || user.role !== UserRole.TECHNICIAN) return;

    updateTechnicianStatus(user.id, {
      isActive: false,
      currentStatus: 'offline',
      currentJobId: undefined,
      currentJobTitle: undefined,
    });

    console.log(`Technician ${user.name} marked as offline`);
  };

  const sendHeartbeat = () => {
    if (!user || user.role !== UserRole.TECHNICIAN) return;

    updateTechnicianStatus(user.id, {
      lastSeen: new Date(),
    });
  };

  const getActiveTechnicians = (): TechnicianStatus[] => {
    return technicians.filter(tech => tech.isActive);
  };

  const getAvailableTechnicians = (): TechnicianStatus[] => {
    return technicians.filter(tech => tech.isActive && tech.currentStatus === 'available');
  };

  const getTechnicianById = (id: string): TechnicianStatus | undefined => {
    return technicians.find(tech => tech.id === id);
  };

  const value: TechnicianStatusContextType = {
    technicians,
    currentUserStatus,
    updateStatus,
    setCurrentJob,
    clearCurrentJob,
    markActive,
    markOffline,
    sendHeartbeat,
    getActiveTechnicians,
    getAvailableTechnicians,
    getTechnicianById,
  };

  return (
    <TechnicianStatusContext.Provider value={value}>
      {children}
    </TechnicianStatusContext.Provider>
  );
};

export const useTechnicianStatus = (): TechnicianStatusContextType => {
  const context = useContext(TechnicianStatusContext);
  if (context === undefined) {
    throw new Error('useTechnicianStatus must be used within a TechnicianStatusProvider');
  }
  return context;
};

// Hook for office managers to monitor technician status
export const useMonitorTechnicians = () => {
  const { technicians, getActiveTechnicians, getAvailableTechnicians } = useTechnicianStatus();
  
  return {
    allTechnicians: technicians,
    activeTechnicians: getActiveTechnicians(),
    availableTechnicians: getAvailableTechnicians(),
    totalTechnicians: technicians.length,
    onlineCount: technicians.filter(t => t.isActive).length,
    busyCount: technicians.filter(t => t.currentStatus === 'busy').length,
  };
};

export default TechnicianStatusContext;
