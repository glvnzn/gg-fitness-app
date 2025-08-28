import React from 'react';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { Animated, Easing } from 'react-native';

interface StaticCircularTimerProps {
  progress: number; // 0 to 100
  isActive: boolean;
  onPress: () => void;
  timeText: string;
  statusText: string;
  remainingText?: string;
}

export const StaticCircularTimer: React.FC<StaticCircularTimerProps> = ({
  progress,
  isActive,
  onPress,
  timeText,
  statusText,
  remainingText,
}) => {
  const [buttonScale] = React.useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    onPress();
  };

  // Calculate progress color
  const getProgressColor = () => {
    if (progress < 33) return Colors.grey40;
    if (progress < 66) return Colors.primary;
    return Colors.success;
  };

  const circleSize = 280;
  const strokeWidth = 12;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* Background Circle */}
      <View
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          borderWidth: strokeWidth,
          borderColor: Colors.grey20,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Progress Circle Overlay */}
        <View
          style={{
            position: 'absolute',
            top: -strokeWidth,
            left: -strokeWidth,
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            borderWidth: strokeWidth,
            borderColor: 'transparent',
            borderTopColor: getProgressColor(),
            transform: [
              { rotate: '-90deg' },
              { 
                rotate: `${(progress / 100) * 360 - 90}deg` 
              }
            ],
          }}
        />

        {/* Center Content */}
        <View style={{ alignItems: 'center', width: circleSize * 0.7 }}>
          {/* Time Display */}
          <Text 
            style={{ 
              fontSize: 36, 
              fontWeight: '300', 
              color: Colors.grey90,
              marginBottom: 8,
            }}
          >
            {timeText}
          </Text>

          {/* Status Text */}
          <Text 
            body1 
            grey70 
            center 
            marginB-8
            style={{ fontWeight: '500' }}
          >
            {statusText}
          </Text>

          {/* Remaining Time */}
          {remainingText && (
            <Text caption grey60 center marginB-20>
              {remainingText}
            </Text>
          )}

          {/* Center Action Button */}
          <Animated.View
            style={{
              transform: [{ scale: buttonScale }],
            }}
          >
            <TouchableOpacity
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: isActive ? Colors.warning : Colors.success,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: Colors.black,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 8,
              }}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
            >
              <Text 
                button 
                white 
                style={{ fontWeight: '600' }}
              >
                {isActive ? 'STOP' : 'START'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};