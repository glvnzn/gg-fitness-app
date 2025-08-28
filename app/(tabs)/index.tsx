import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { 
  View, 
  Text, 
  Card, 
  Button, 
  Colors, 
  TouchableOpacity,
  Carousel
} from 'react-native-ui-lib';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withRepeat,
  withSequence
} from 'react-native-reanimated';

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
  
  // Animation values
  const pulseScale = useSharedValue(1);
  const progressAnimation = useSharedValue(0);

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Pulse animation for active fasting
  useEffect(() => {
    if (fastingState.isActive) {
      pulseScale.value = withRepeat(
        withSequence(
          withSpring(1.05, { duration: 1000 }),
          withSpring(1, { duration: 1000 })
        ),
        -1,
        false
      );
    } else {
      pulseScale.value = withSpring(1);
    }
  }, [fastingState.isActive, pulseScale]);

  // Progress animation
  useEffect(() => {
    if (fastingState.isActive) {
      const progress = getCurrentProgress();
      progressAnimation.value = withSpring(progress.percentage / 100);
    } else {
      progressAnimation.value = withSpring(0);
    }
  }, [fastingState.isActive, getCurrentProgress, progressAnimation]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  if (loading) {
    return (
      <View flex center>
        <Text h3 grey50>Loading...</Text>
      </View>
    );
  }

  const progress = getCurrentProgress();
  const stats = getStats();

  const handlePlanSelect = (plan: FastingPlan) => {
    if (plan.id === 'custom') {
      setShowCustomModal(true);
    } else {
      selectPlan(plan);
    }
  };

  const handleCustomPlanSave = (customPlan: FastingPlan) => {
    saveCustomPlan(customPlan);
  };

  const handleStartFasting = () => {
    Alert.alert(
      'Start Fasting',
      `Begin ${fastingState.selectedPlan.name} fast?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start', onPress: () => startFasting() }
      ]
    );
  };

  const handleStopFasting = () => {
    Alert.alert(
      'End Fast',
      'Complete your fasting session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Complete', onPress: stopFasting },
        { text: 'Cancel Fast', onPress: cancelFasting, style: 'destructive' }
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
    <View flex bg-grey10 padding-20>
      {/* Header */}
      <View centerH marginB-30 marginT-20>
        <Text h1 grey90 marginB-8>Fasting Tracker</Text>
        <Text h4 grey60 marginB-20>{fastingState.selectedPlan.name} Plan</Text>
        
        {/* Streak Cards */}
        <View row gap-16>
          <Card padding-16 br40 bg-white style={{ shadowColor: Colors.grey40, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}>
            <View centerH>
              <Text h2 primary marginB-4>{stats.currentStreak}</Text>
              <Text caption grey60>Current Streak</Text>
            </View>
          </Card>
          <Card padding-16 br40 bg-white style={{ shadowColor: Colors.grey40, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}>
            <View centerH>
              <Text h2 secondary marginB-4>{stats.longestStreak}</Text>
              <Text caption grey60>Best Streak</Text>
            </View>
          </Card>
        </View>
      </View>

      {/* Progress Circle */}
      <View centerH marginB-40>
        <Animated.View style={[pulseStyle]}>
          <Card
            padding-0
            br200
            width={250}
            height={250}
            style={{ 
              shadowColor: Colors.grey40, 
              shadowOpacity: 0.15, 
              shadowRadius: 20, 
              elevation: 8,
              overflow: 'hidden'
            }}
          >
            <LinearGradient
              colors={fastingState.isActive ? Colors.successGradient : [Colors.grey20, Colors.grey30]}
              style={{
                width: 250,
                height: 250,
                borderRadius: 125,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                bg-white
                br100
                width={200}
                height={200}
                center
              >
                {fastingState.isActive ? (
                  <View centerH>
                    <Text h1 grey90 marginB-8>
                      {formatTimeDetailed(progress.elapsedMs)}
                    </Text>
                    <Text body1 success marginB-4>
                      {Math.floor(progress.percentage)}% Complete
                    </Text>
                    <Text caption grey60>
                      {formatTime(progress.remaining)} remaining
                    </Text>
                  </View>
                ) : (
                  <View centerH>
                    <Text h2 grey80 marginB-8>
                      Ready to Fast
                    </Text>
                    <Text body2 grey60 center style={{ maxWidth: 160 }}>
                      {fastingState.selectedPlan.description}
                    </Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </Card>
        </Animated.View>
      </View>

      {/* Plan Selection */}
      {!fastingState.isActive && (
        <View marginB-30>
          <Text h5 grey80 marginB-16 center>Choose Fasting Plan</Text>
          <Carousel
            containerStyle={{ height: 80 }}
            pageControlProps={{
              size: 6,
              spacing: 8,
              color: Colors.grey40,
              inactiveColor: Colors.grey30,
            }}
            showCounter={false}
            autoplay={false}
          >
            {availablePlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                onPress={() => handlePlanSelect(plan)}
                style={{ marginHorizontal: 8 }}
              >
                <Card
                  padding-16
                  br20
                  centerH
                  bg-white
                  style={{
                    minWidth: 100,
                    shadowColor: Colors.grey40,
                    shadowOpacity: fastingState.selectedPlan.id === plan.id ? 0.2 : 0.1,
                    shadowRadius: 8,
                    elevation: fastingState.selectedPlan.id === plan.id ? 6 : 3,
                    borderWidth: fastingState.selectedPlan.id === plan.id ? 2 : 0,
                    borderColor: fastingState.selectedPlan.id === plan.id ? Colors.primary : 'transparent',
                  }}
                >
                  <Text 
                    h6 
                    style={{ color: fastingState.selectedPlan.id === plan.id ? Colors.primary : Colors.grey80 }}
                    marginB-4
                  >
                    {plan.name}
                  </Text>
                  {plan.id === 'custom' && (
                    <Text caption grey50>
                      Tap to edit
                    </Text>
                  )}
                </Card>
              </TouchableOpacity>
            ))}
          </Carousel>
        </View>
      )}

      {/* Action Button */}
      <View centerH>
        <Button
          label={fastingState.isActive ? 'End Fast' : 'Start Fasting'}
          size="large"
          borderRadius={30}
          paddingH-48
          paddingV-16
          backgroundColor={fastingState.isActive ? Colors.warning : Colors.success}
          labelStyle={{ 
            color: Colors.white, 
            fontSize: 18, 
            fontWeight: '600' 
          }}
          style={{
            minWidth: 200,
            shadowColor: fastingState.isActive ? Colors.warning : Colors.success,
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
          onPress={fastingState.isActive ? handleStopFasting : handleStartFasting}
        />
      </View>

      <CustomPlanModal
        visible={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onSave={handleCustomPlanSave}
        currentPlan={fastingState.customPlan}
      />
    </View>
  );
}

// All styles are now handled by UI Lib components and theme
