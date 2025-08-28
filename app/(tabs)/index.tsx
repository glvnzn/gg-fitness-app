import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, Animated } from 'react-native';
import { 
  View, 
  Text, 
  Colors, 
  TouchableOpacity
} from 'react-native-ui-lib';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { StaticCircularTimer } from '@/components/StaticCircularTimer';
import { CustomPlanModal } from '@/components/CustomPlanModal';
import { useFasting } from '@/hooks/useFasting';
import { FastingPlan } from '@/types/fasting';

export default function HomeScreen() {
  const {
    fastingState,
    startFasting,
    stopFasting,
    cancelFasting,
    selectPlan,
    getCurrentProgress,
    getStats,
    saveCustomPlan,
    availablePlans,
    loading
  } = useFasting();

  const [, setCurrentTime] = useState(Date.now());
  const [showCustomModal, setShowCustomModal] = useState(false);
  
  // Standard React Native animations instead of Reanimated
  const [fadeAnim] = useState(new Animated.Value(0));

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Entrance animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  if (loading) {
    return (
      <View flex center>
        <Text h3 grey50>Loading...</Text>
      </View>
    );
  }

  const progress = getCurrentProgress();
  const stats = getStats();

  const handlePlanSelect = async (plan: FastingPlan) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      // Haptics not available, continue silently
    }
    
    if (plan.id === 'custom') {
      setShowCustomModal(true);
    } else {
      selectPlan(plan);
    }
  };

  const handleCustomPlanSave = (customPlan: FastingPlan) => {
    saveCustomPlan(customPlan);
  };

  const handleStartFasting = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (e) {
      // Haptics not available, continue silently
    }
    
    Alert.alert(
      'Start Fasting',
      `Begin ${fastingState.selectedPlan.name} fast?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start', 
          onPress: async () => {
            try {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (e) {
              // Haptics not available, continue silently
            }
            startFasting();
          }
        }
      ]
    );
  };

  const handleStopFasting = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (e) {
      // Haptics not available, continue silently
    }
    
    Alert.alert(
      'End Fast',
      'Complete your fasting session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Complete', 
          onPress: async () => {
            try {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (e) {
              // Haptics not available, continue silently
            }
            stopFasting();
          }
        },
        { 
          text: 'Cancel Fast', 
          onPress: async () => {
            try {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            } catch (e) {
              // Haptics not available, continue silently
            }
            cancelFasting();
          }, 
          style: 'destructive' 
        }
      ]
    );
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTimeDetailed = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View flex>
      <LinearGradient
        colors={[Colors.grey10, Colors.white]}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Header */}
            <View centerH marginB-24>
              <Text 
                style={{ 
                  fontSize: fastingState.isActive ? 24 : 28, 
                  fontWeight: fastingState.isActive ? '600' : '300', 
                  color: fastingState.isActive ? Colors.primary : Colors.grey90,
                  marginBottom: 4
                }}
              >
                {fastingState.isActive ? 'Fasting in Progress' : 'Intermittent Fasting'}
              </Text>
              <Text body1 grey60>
                {fastingState.selectedPlan.name} • {fastingState.selectedPlan.description}
              </Text>
              {fastingState.isActive && (
                <View centerH marginT-8>
                  <View 
                    style={{
                      backgroundColor: Colors.success,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 20,
                    }}
                  >
                    <Text caption white style={{ fontWeight: '600' }}>
                      ⏱️ Active Fast
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Enhanced Streak Card */}
            <View 
              style={{
                backgroundColor: Colors.white,
                borderRadius: 20,
                padding: 20,
                marginBottom: 32,
                shadowColor: Colors.grey40,
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 4,
                borderWidth: stats.currentStreak >= 7 ? 2 : 0,
                borderColor: stats.currentStreak >= 7 ? Colors.success : 'transparent',
              }}
            >
              {stats.currentStreak >= 7 && (
                <View centerH marginB-12>
                  <Text caption success style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>
                    🔥 ON FIRE!
                  </Text>
                </View>
              )}
              
              <View row center gap-20>
                <View centerH flex>
                  <Text h2 primary style={{ fontWeight: '700' }}>
                    {stats.currentStreak}
                  </Text>
                  <Text caption grey60 style={{ fontWeight: '500' }}>Current Streak</Text>
                </View>
                
                <View width={2} height={40} style={{ backgroundColor: Colors.grey20, borderRadius: 1 }} />
                
                <View centerH flex>
                  <Text h2 secondary style={{ fontWeight: '700' }}>
                    {stats.longestStreak}
                  </Text>
                  <Text caption grey60 style={{ fontWeight: '500' }}>Personal Best</Text>
                </View>
                
                <View width={2} height={40} style={{ backgroundColor: Colors.grey20, borderRadius: 1 }} />
                
                <View centerH flex>
                  <Text h2 accent style={{ fontWeight: '700' }}>
                    {Math.round((stats.completedSessions / Math.max(stats.totalSessions, 1)) * 100)}%
                  </Text>
                  <Text caption grey60 style={{ fontWeight: '500' }}>Success Rate</Text>
                </View>
              </View>
              
              {stats.currentStreak > 0 && (
                <View centerH marginT-16 paddingT-16 style={{ borderTopWidth: 1, borderTopColor: Colors.grey20 }}>
                  <Text caption grey70>
                    {stats.currentStreak === 1 
                      ? "Great start! Keep going tomorrow 💪" 
                      : `${stats.currentStreak} days of dedication! Keep it up! 🌟`}
                  </Text>
                </View>
              )}
            </View>

            {/* Main Circular Timer */}
            <View centerH marginB-40>
              <StaticCircularTimer
                progress={progress.percentage}
                isActive={fastingState.isActive}
                onPress={fastingState.isActive ? handleStopFasting : handleStartFasting}
                timeText={fastingState.isActive ? formatTimeDetailed(progress.elapsedMs || 0) : "Ready"}
                statusText={
                  fastingState.isActive 
                    ? `${Math.floor(progress.percentage)}% Complete`
                    : "Tap to start fasting"
                }
                remainingText={
                  fastingState.isActive 
                    ? `${formatTime(progress.remaining)} remaining`
                    : undefined
                }
              />
            </View>

            {/* Plan Selection Chips */}
            {!fastingState.isActive && (
              <View centerH marginB-20>
                <Text h6 grey70 marginB-16>
                  Fasting Plans
                </Text>
                <View row center style={{ flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                  {availablePlans.map((plan) => {
                    const isSelected = fastingState.selectedPlan.id === plan.id;
                    return (
                      <TouchableOpacity
                        key={plan.id}
                        onPress={() => handlePlanSelect(plan)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={{
                            backgroundColor: isSelected ? Colors.primary : Colors.white,
                            borderRadius: 25,
                            paddingHorizontal: 20,
                            paddingVertical: 12,
                            borderWidth: 2,
                            borderColor: isSelected ? Colors.primary : Colors.grey30,
                            shadowColor: isSelected ? Colors.primary : Colors.grey40,
                            shadowOpacity: isSelected ? 0.3 : 0.1,
                            shadowRadius: isSelected ? 8 : 4,
                            elevation: isSelected ? 6 : 2,
                            minWidth: 80,
                            alignItems: 'center',
                            transform: [{ scale: isSelected ? 1.05 : 1 }],
                          }}
                        >
                          <Text
                            style={{
                              color: isSelected ? Colors.white : Colors.grey70,
                              fontWeight: isSelected ? '700' : '600',
                              fontSize: 15,
                            }}
                          >
                            {plan.name}
                          </Text>
                          {isSelected && (
                            <Text
                              style={{
                                color: Colors.white,
                                fontSize: 10,
                                marginTop: 2,
                                fontWeight: '500',
                                opacity: 0.8,
                              }}
                            >
                              ✓ Selected
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                
                {fastingState.selectedPlan.id === 'custom' && (
                  <Text caption grey60 center marginT-8>
                    Tap Custom again to edit your plan
                  </Text>
                )}
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </LinearGradient>

      <CustomPlanModal
        visible={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onSave={handleCustomPlanSave}
        currentPlan={fastingState.customPlan || undefined}
      />
    </View>
  );
}