import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FastingSession, FastingState, FastingPlan, FastingStats, FASTING_PLANS } from '@/types/fasting';

const STORAGE_KEYS = {
  FASTING_STATE: 'fastingState',
  FASTING_HISTORY: 'fastingHistory',
  SELECTED_PLAN: 'selectedPlan'
};

export const useFasting = () => {
  const [fastingState, setFastingState] = useState<FastingState>({
    isActive: false,
    selectedPlan: FASTING_PLANS[0]
  });
  
  const [history, setHistory] = useState<FastingSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved state on mount
  useEffect(() => {
    loadFastingState();
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    if (!loading) {
      saveFastingState();
    }
  }, [fastingState, loading]);

  const loadFastingState = async () => {
    try {
      const [stateData, historyData, planData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.FASTING_STATE),
        AsyncStorage.getItem(STORAGE_KEYS.FASTING_HISTORY),
        AsyncStorage.getItem(STORAGE_KEYS.SELECTED_PLAN)
      ]);

      if (stateData) {
        const parsedState = JSON.parse(stateData);
        setFastingState(parsedState);
      }

      if (historyData) {
        setHistory(JSON.parse(historyData));
      }

      if (planData) {
        const savedPlan = JSON.parse(planData);
        setFastingState(prev => ({ ...prev, selectedPlan: savedPlan }));
      }
    } catch (error) {
      console.error('Error loading fasting state:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFastingState = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.FASTING_STATE, JSON.stringify(fastingState)),
        AsyncStorage.setItem(STORAGE_KEYS.FASTING_HISTORY, JSON.stringify(history)),
        AsyncStorage.setItem(STORAGE_KEYS.SELECTED_PLAN, JSON.stringify(fastingState.selectedPlan))
      ]);
    } catch (error) {
      console.error('Error saving fasting state:', error);
    }
  };

  const startFasting = useCallback((plan?: FastingPlan) => {
    const selectedPlan = plan || fastingState.selectedPlan;
    const now = Date.now();
    
    const newSession: FastingSession = {
      id: `session_${now}`,
      startTime: now,
      goalDuration: selectedPlan.fastingHours * 60, // convert to minutes
      completed: false,
      plan: selectedPlan
    };

    setFastingState({
      isActive: true,
      currentSession: newSession,
      selectedPlan
    });
  }, [fastingState.selectedPlan]);

  const stopFasting = useCallback(() => {
    if (!fastingState.currentSession) return;

    const now = Date.now();
    const completedSession: FastingSession = {
      ...fastingState.currentSession,
      endTime: now,
      completed: true
    };

    setHistory(prev => [completedSession, ...prev]);
    setFastingState(prev => ({
      ...prev,
      isActive: false,
      currentSession: undefined
    }));
  }, [fastingState.currentSession]);

  const cancelFasting = useCallback(() => {
    if (!fastingState.currentSession) return;

    const now = Date.now();
    const cancelledSession: FastingSession = {
      ...fastingState.currentSession,
      endTime: now,
      completed: false
    };

    setHistory(prev => [cancelledSession, ...prev]);
    setFastingState(prev => ({
      ...prev,
      isActive: false,
      currentSession: undefined
    }));
  }, [fastingState.currentSession]);

  const selectPlan = useCallback((plan: FastingPlan) => {
    setFastingState(prev => ({
      ...prev,
      selectedPlan: plan
    }));
  }, []);

  // Calculate current progress
  const getCurrentProgress = useCallback(() => {
    if (!fastingState.currentSession) {
      return {
        elapsed: 0,
        remaining: 0,
        percentage: 0,
        isComplete: false
      };
    }

    const now = Date.now();
    const elapsed = now - fastingState.currentSession.startTime;
    const elapsedMinutes = Math.floor(elapsed / (1000 * 60));
    const goalMinutes = fastingState.currentSession.goalDuration;
    const remaining = Math.max(0, goalMinutes - elapsedMinutes);
    const percentage = Math.min(100, (elapsedMinutes / goalMinutes) * 100);
    const isComplete = elapsedMinutes >= goalMinutes;

    return {
      elapsed: elapsedMinutes,
      remaining,
      percentage,
      isComplete,
      elapsedMs: elapsed,
      goalMs: goalMinutes * 60 * 1000
    };
  }, [fastingState.currentSession]);

  // Calculate streak information
  const calculateStreaks = useCallback(() => {
    if (history.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const sortedHistory = [...history]
      .filter(session => session.completed)
      .sort((a, b) => b.startTime - a.startTime);

    if (sortedHistory.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let currentStreakCount = 0;
    let tempStreakCount = 1;

    // Check if the most recent session was completed
    const mostRecent = sortedHistory[0];
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    if (mostRecent.endTime && mostRecent.endTime >= oneDayAgo) {
      currentStreakCount = 1;
    }

    // Calculate current streak from most recent backwards
    for (let i = 1; i < sortedHistory.length && currentStreakCount > 0; i++) {
      const current = sortedHistory[i];
      const previous = sortedHistory[i - 1];
      
      const daysDiff = Math.floor((previous.startTime - current.startTime) / (24 * 60 * 60 * 1000));
      
      if (daysDiff <= 2) { // Allow up to 2 days gap
        currentStreakCount++;
      } else {
        break;
      }
    }

    currentStreak = currentStreakCount;

    // Calculate longest streak
    for (let i = 0; i < sortedHistory.length; i++) {
      if (i === 0 || Math.floor((sortedHistory[i - 1].startTime - sortedHistory[i].startTime) / (24 * 60 * 60 * 1000)) <= 2) {
        tempStreakCount++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreakCount);
        tempStreakCount = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreakCount);

    return { currentStreak, longestStreak };
  }, [history]);

  // Calculate comprehensive stats
  const getStats = useCallback((): FastingStats => {
    const { currentStreak, longestStreak } = calculateStreaks();
    const totalSessions = history.length;
    const completedSessions = history.filter(s => s.completed).length;
    
    const totalFastingTime = history.reduce((total, session) => {
      if (session.endTime) {
        const duration = Math.floor((session.endTime - session.startTime) / (1000 * 60));
        return total + duration;
      }
      return total;
    }, 0);

    const averageFastDuration = completedSessions > 0 
      ? Math.floor(totalFastingTime / completedSessions) 
      : 0;

    return {
      currentStreak,
      longestStreak,
      totalSessions,
      completedSessions,
      totalFastingTime,
      averageFastDuration
    };
  }, [history, calculateStreaks]);

  // Save custom plan
  const saveCustomPlan = useCallback((plan: FastingPlan) => {
    setFastingState(prev => ({
      ...prev,
      customPlan: plan,
      selectedPlan: plan
    }));
  }, []);

  // Get available plans including custom
  const getAvailablePlans = useCallback(() => {
    const plans = [...FASTING_PLANS];
    if (fastingState.customPlan && fastingState.customPlan.id === 'custom') {
      const customIndex = plans.findIndex(p => p.id === 'custom');
      if (customIndex >= 0) {
        plans[customIndex] = fastingState.customPlan;
      }
    }
    return plans;
  }, [fastingState.customPlan]);

  return {
    fastingState,
    history,
    loading,
    startFasting,
    stopFasting,
    cancelFasting,
    selectPlan,
    getCurrentProgress,
    getStats,
    saveCustomPlan,
    availablePlans: getAvailablePlans()
  };
};