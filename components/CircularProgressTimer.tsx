import React from 'react';
import { Dimensions } from 'react-native';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
  useAnimatedStyle,
  withSequence,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface CircularProgressTimerProps {
  progress: number; // 0 to 100
  isActive: boolean;
  onPress: () => void;
  timeText: string;
  statusText: string;
  remainingText?: string;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CIRCLE_SIZE = SCREEN_WIDTH * 0.8;
const STROKE_WIDTH = 8;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = RADIUS * 2 * Math.PI;

export const CircularProgressTimer: React.FC<CircularProgressTimerProps> = ({
  progress,
  isActive,
  onPress,
  timeText,
  statusText,
  remainingText,
}) => {
  const animatedProgress = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 1000 });
  }, [progress, animatedProgress]);

  React.useEffect(() => {
    if (isActive) {
      // Subtle pulse animation when active
      pulseScale.value = withSpring(1.02, { duration: 2000 });
    } else {
      pulseScale.value = withSpring(1);
    }
  }, [isActive, pulseScale]);

  const animatedCircleProps = useAnimatedProps(() => {
    const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * animatedProgress.value) / 100;
    
    return {
      strokeDashoffset,
      stroke: interpolateColor(
        animatedProgress.value,
        [0, 50, 100],
        [Colors.grey30, Colors.primary, Colors.success]
      ),
    };
  });

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    backgroundColor: isActive ? Colors.warning : Colors.success,
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    buttonScale.value = withSequence(
      withSpring(1.05, { duration: 100 }),
      withSpring(1, { duration: 200 })
    );
    onPress();
  };

  return (
    <Animated.View style={[pulseStyle]}>
      <View center>
        {/* Background Circle */}
        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={{ position: 'absolute' }}>
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke={Colors.grey20}
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
          />
          {/* Progress Circle */}
          <AnimatedCircle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
            strokeDasharray={CIRCUMFERENCE}
            strokeLinecap="round"
            animatedProps={animatedCircleProps}
            rotation="-90"
            origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
          />
        </Svg>

        {/* Center Content */}
        <View center style={{ width: CIRCLE_SIZE * 0.7, height: CIRCLE_SIZE * 0.7 }}>
          {/* Time Display */}
          <Text 
            style={{ 
              fontSize: 36, 
              fontWeight: '300', 
              color: Colors.grey90,
              marginBottom: 8,
              fontVariant: ['tabular-nums'] // Monospace numbers
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

          {/* Remaining Time (if active) */}
          {remainingText && (
            <Text caption grey60 center marginB-20>
              {remainingText}
            </Text>
          )}

          {/* Center Action Button */}
          <AnimatedTouchable
            style={[
              {
                width: 80,
                height: 80,
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: Colors.black,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 8,
              },
              buttonAnimatedStyle,
            ]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
          >
            <Text 
              button 
              white 
              style={{ fontWeight: '600' }}
            >
              {isActive ? 'STOP' : 'START'}
            </Text>
          </AnimatedTouchable>
        </View>
      </View>
    </Animated.View>
  );
};