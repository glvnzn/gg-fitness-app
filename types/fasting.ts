export interface FastingSession {
  id: string;
  startTime: number;
  endTime?: number;
  goalDuration: number; // in minutes
  completed: boolean;
  plan: FastingPlan;
}

export interface FastingPlan {
  id: string;
  name: string;
  fastingHours: number;
  eatingHours: number;
  description: string;
}

export interface FastingStats {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  completedSessions: number;
  totalFastingTime: number; // in minutes
  averageFastDuration: number; // in minutes
}

export interface FastingState {
  isActive: boolean;
  currentSession?: FastingSession;
  selectedPlan: FastingPlan;
  customPlan?: FastingPlan;
}

export const FASTING_PLANS: FastingPlan[] = [
  {
    id: '16-8',
    name: '16:8',
    fastingHours: 16,
    eatingHours: 8,
    description: '16 hours fasting, 8 hours eating window'
  },
  {
    id: '18-6',
    name: '18:6',
    fastingHours: 18,
    eatingHours: 6,
    description: '18 hours fasting, 6 hours eating window'
  },
  {
    id: '20-4',
    name: '20:4',
    fastingHours: 20,
    eatingHours: 4,
    description: '20 hours fasting, 4 hours eating window (Warrior Diet)'
  },
  {
    id: '24-0',
    name: '24:0',
    fastingHours: 24,
    eatingHours: 0,
    description: '24 hour fast (OMAD)'
  },
  {
    id: 'custom',
    name: 'Custom',
    fastingHours: 16,
    eatingHours: 8,
    description: 'Create your own fasting schedule'
  }
];