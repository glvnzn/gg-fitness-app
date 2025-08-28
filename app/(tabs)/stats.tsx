import React from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { 
  View, 
  Text, 
  Card, 
  Colors,
  Badge
} from 'react-native-ui-lib';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withDelay
} from 'react-native-reanimated';

import { useFasting } from '@/hooks/useFasting';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const { getStats, history } = useFasting();
  const stats = getStats();
  
  // Animation values for staggered card entrance
  const card1Scale = useSharedValue(0);
  const card2Scale = useSharedValue(0);
  const card3Scale = useSharedValue(0);
  const card4Scale = useSharedValue(0);

  React.useEffect(() => {
    card1Scale.value = withSpring(1);
    card2Scale.value = withDelay(100, withSpring(1));
    card3Scale.value = withDelay(200, withSpring(1));
    card4Scale.value = withDelay(300, withSpring(1));
  }, [card1Scale, card2Scale, card3Scale, card4Scale]);

  const card1Style = useAnimatedStyle(() => ({
    transform: [{ scale: card1Scale.value }],
  }));

  const card2Style = useAnimatedStyle(() => ({
    transform: [{ scale: card2Scale.value }],
  }));

  const card3Style = useAnimatedStyle(() => ({
    transform: [{ scale: card3Scale.value }],
  }));

  const card4Style = useAnimatedStyle(() => ({
    transform: [{ scale: card4Scale.value }],
  }));

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTotalTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (days > 0) {
      return `${days}d ${remainingHours}h`;
    }
    return `${hours}h`;
  };

  const getRecentActivity = () => {
    const last7Days = history
      .filter(session => {
        const sessionDate = new Date(session.startTime);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return sessionDate >= weekAgo;
      })
      .sort((a, b) => b.startTime - a.startTime);

    return last7Days;
  };

  const getSuccessRate = () => {
    if (stats.totalSessions === 0) return 0;
    return Math.round((stats.completedSessions / stats.totalSessions) * 100);
  };

  const recentActivity = getRecentActivity();
  const successRate = getSuccessRate();

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    iconColor = Colors.primary,
    animationStyle 
  }: {
    title: string;
    value: string;
    subtitle?: string;
    iconColor?: string;
    animationStyle?: any;
  }) => (
    <Animated.View style={[animationStyle]}>
      <Card
        padding-20
        br20
        bg-white
        style={{
          width: (screenWidth - 60) / 2,
          marginBottom: 16,
          shadowColor: Colors.grey40,
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <View centerH>
          <View 
            width={8} 
            height={8} 
            br4 
            style={{ backgroundColor: iconColor }} 
            marginB-8
          />
          <Text caption grey60 marginB-8 center>
            {title}
          </Text>
          <Text h2 grey90 marginB-4>
            {value}
          </Text>
          {subtitle && (
            <Text caption grey50 center>
              {subtitle}
            </Text>
          )}
        </View>
      </Card>
    </Animated.View>
  );

  return (
    <View flex bg-grey10 padding-20>
      {/* Header */}
      <View centerH marginB-30 marginT-20>
        <Text h1 grey90 marginB-8>Statistics</Text>
        <Text body1 grey60>
          Your fasting journey overview
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Stats Grid */}
        <View row style={{ justifyContent: 'space-between', flexWrap: 'wrap' }} marginB-30>
          <StatCard
            title="Current Streak"
            value={stats.currentStreak.toString()}
            subtitle={stats.currentStreak === 1 ? 'day' : 'days'}
            iconColor={Colors.success}
            animationStyle={card1Style}
          />
          <StatCard
            title="Best Streak"
            value={stats.longestStreak.toString()}
            subtitle={stats.longestStreak === 1 ? 'day' : 'days'}
            iconColor={Colors.secondary}
            animationStyle={card2Style}
          />
          <StatCard
            title="Success Rate"
            value={`${successRate}%`}
            subtitle={`${stats.completedSessions}/${stats.totalSessions} completed`}
            iconColor={Colors.warning}
            animationStyle={card3Style}
          />
          <StatCard
            title="Total Fasting"
            value={formatTotalTime(stats.totalFastingTime)}
            subtitle="time invested"
            iconColor={Colors.accent}
            animationStyle={card4Style}
          />
        </View>

        {/* Detailed Stats */}
        <Card padding-20 br20 bg-white marginB-24 style={{ shadowColor: Colors.grey40, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 }}>
          <Text h5 grey90 marginB-16>
            Detailed Statistics
          </Text>
          
          <View>
            <View row spread centerV paddingV-12 style={{ borderBottomWidth: 1, borderBottomColor: Colors.grey20 }}>
              <Text body2 grey70>Average Fast Duration</Text>
              <Text body2 grey90 style={{ fontWeight: '600' }}>
                {formatTime(stats.averageFastDuration)}
              </Text>
            </View>
            
            <View row spread centerV paddingV-12 style={{ borderBottomWidth: 1, borderBottomColor: Colors.grey20 }}>
              <Text body2 grey70>Total Sessions</Text>
              <Text body2 grey90 style={{ fontWeight: '600' }}>
                {stats.totalSessions}
              </Text>
            </View>
            
            <View row spread centerV paddingV-12 style={{ borderBottomWidth: 1, borderBottomColor: Colors.grey20 }}>
              <Text body2 grey70>Completed Sessions</Text>
              <View row centerV>
                <View width={6} height={6} br3 bg-success marginR-8 />
                <Text body2 grey90 style={{ fontWeight: '600' }}>
                  {stats.completedSessions}
                </Text>
              </View>
            </View>
            
            <View row spread centerV paddingV-12>
              <Text body2 grey70>Cancelled Sessions</Text>
              <View row centerV>
                <View width={6} height={6} br3 bg-error marginR-8 />
                <Text body2 grey90 style={{ fontWeight: '600' }}>
                  {stats.totalSessions - stats.completedSessions}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Recent Activity */}
        <View marginB-24>
          <Text h5 grey90 marginB-16>
            Recent Activity (Last 7 Days)
          </Text>
          
          {recentActivity.length === 0 ? (
            <Card padding-40 br20 bg-white style={{ shadowColor: Colors.grey40, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 }}>
              <View centerH>
                <Text body2 grey60>
                  No activity in the last 7 days
                </Text>
              </View>
            </Card>
          ) : (
            <View gap-12>
              {recentActivity.map((session, index) => (
                <Card 
                  key={session.id} 
                  padding-16 
                  br16 
                  bg-white 
                  style={{ shadowColor: Colors.grey40, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}
                >
                  <View row spread centerV marginB-8>
                    <Text body1 grey90 style={{ fontWeight: '600' }}>
                      {session.plan.name} Fast
                    </Text>
                    <Badge
                      size={24}
                      backgroundColor={session.completed ? Colors.success : Colors.error}
                      borderWidth={0}
                    >
                      <Text caption white>
                        {session.completed ? '✓' : '✗'}
                      </Text>
                    </Badge>
                  </View>
                  
                  <Text caption grey60 marginB-4>
                    {new Date(session.startTime).toLocaleDateString()} at{' '}
                    {new Date(session.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                  
                  {session.endTime && (
                    <View row centerV>
                      <View width={4} height={4} br2 bg-primary marginR-8 />
                      <Text caption grey70>
                        Duration: {formatTime(Math.floor((session.endTime - session.startTime) / (1000 * 60)))}
                      </Text>
                    </View>
                  )}
                </Card>
              ))}
            </View>
          )}
        </View>

        {/* Motivational Section */}
        {stats.currentStreak > 0 && (
          <Card 
            padding-20 
            br20 
            marginB-40
            style={{
              shadowColor: Colors.success,
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <LinearGradient 
              colors={[Colors.grey10, Colors.white]} 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 20,
              }}
            />
            <View centerH>
              <Text h6 success marginB-8>
                🎉 Great Progress!
              </Text>
              <Text body2 grey70 center marginB-8>
                {stats.currentStreak === 1 
                  ? "You&apos;re on a roll! Keep up the great work."
                  : `${stats.currentStreak} days strong! You&apos;re building a healthy habit.`}
              </Text>
              {stats.currentStreak >= 7 && (
                <Badge 
                  backgroundColor={Colors.warning} 
                  borderWidth={0}
                  paddingH-12
                  paddingV-6
                >
                  <Text caption white style={{ fontWeight: '600' }}>
                    ⭐ Weekly Warrior
                  </Text>
                </Badge>
              )}
            </View>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

// All styles are now handled by UI Lib components and theme