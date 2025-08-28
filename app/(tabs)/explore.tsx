import React from 'react';
import { ScrollView } from 'react-native';
import { 
  View, 
  Text, 
  Card, 
  Colors,
  Badge,
  TextField
} from 'react-native-ui-lib';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withDelay
} from 'react-native-reanimated';

import { useFasting } from '@/hooks/useFasting';
import { FastingSession } from '@/types/fasting';

export default function HistoryScreen() {
  const { history } = useFasting();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Animation for list items
  const listAnimation = useSharedValue(0);
  
  React.useEffect(() => {
    listAnimation.value = withSpring(1);
  }, [listAnimation]);

  const listStyle = useAnimatedStyle(() => ({
    opacity: listAnimation.value,
    transform: [{ translateY: (1 - listAnimation.value) * 50 }],
  }));

  const filteredHistory = history.filter(session => {
    if (!searchQuery) return true;
    return session.plan.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDuration = (startTime: number, endTime: number) => {
    const duration = endTime - startTime;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const HistoryItem = ({ session, index }: { session: FastingSession, index: number }) => {
    const itemAnimation = useSharedValue(0);
    
    React.useEffect(() => {
      itemAnimation.value = withDelay(index * 50, withSpring(1));
    }, [itemAnimation, index]);

    const itemStyle = useAnimatedStyle(() => ({
      opacity: itemAnimation.value,
      transform: [{ translateX: (1 - itemAnimation.value) * 100 }],
    }));

    return (
      <Animated.View style={[itemStyle]}>
        <Card 
          padding-16 
          br16 
          bg-white 
          marginB-12
          style={{ 
            shadowColor: Colors.grey40, 
            shadowOpacity: 0.08, 
            shadowRadius: 12, 
            elevation: 4 
          }}
        >
          <View row spread centerV marginB-12>
            <Text h6 grey90>
              {session.plan.name} Fast
            </Text>
            <Badge
              backgroundColor={session.completed ? Colors.success : Colors.error}
              borderWidth={0}
              paddingH-8
              paddingV-4
            >
              <Text caption white style={{ fontWeight: '600' }}>
                {session.completed ? 'Completed' : 'Cancelled'}
              </Text>
            </Badge>
          </View>
          
          <Text body2 grey70 marginB-12>
            {formatDate(session.startTime)}
          </Text>
          
          <View gap-8>
            <View row spread centerV>
              <View row centerV>
                <View width={6} height={6} br3 bg-primary marginR-8 />
                <Text caption grey60>Started</Text>
              </View>
              <Text caption grey90 style={{ fontWeight: '600' }}>
                {formatTime(session.startTime)}
              </Text>
            </View>
            
            {session.endTime && (
              <>
                <View row spread centerV>
                  <View row centerV>
                    <View width={6} height={6} br3 bg-secondary marginR-8 />
                    <Text caption grey60>Ended</Text>
                  </View>
                  <Text caption grey90 style={{ fontWeight: '600' }}>
                    {formatTime(session.endTime)}
                  </Text>
                </View>
                
                <View row spread centerV>
                  <View row centerV>
                    <View width={6} height={6} br3 bg-accent marginR-8 />
                    <Text caption grey60>Duration</Text>
                  </View>
                  <Text caption grey90 style={{ fontWeight: '600' }}>
                    {formatDuration(session.startTime, session.endTime)}
                  </Text>
                </View>
              </>
            )}
            
            <View row spread centerV paddingT-8 style={{ borderTopWidth: 1, borderTopColor: Colors.grey20 }}>
              <View row centerV>
                <View width={6} height={6} br3 bg-warning marginR-8 />
                <Text caption grey60>Goal</Text>
              </View>
              <Text caption grey90 style={{ fontWeight: '600' }}>
                {Math.floor(session.goalDuration / 60)}h {session.goalDuration % 60}m
              </Text>
            </View>
          </View>
        </Card>
      </Animated.View>
    );
  };

  return (
    <View flex bg-grey10 padding-20>
      {/* Header */}
      <View centerH marginB-20 marginT-20>
        <Text h1 grey90 marginB-8>Fasting History</Text>
        <Text body1 grey60>
          {history.length} {history.length === 1 ? 'session' : 'sessions'}
        </Text>
      </View>

      {/* Search Bar */}
      {history.length > 0 && (
        <View marginB-20>
          <TextField
            placeholder="Search by plan type..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leadingAccessory={
              <View width={20} height={20} center>
                <Text caption grey50>🔍</Text>
              </View>
            }
            fieldStyle={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: Colors.white,
              borderWidth: 1,
              borderColor: Colors.grey30,
            }}
            style={{ 
              fontSize: 16,
              color: Colors.grey90
            }}
          />
        </View>
      )}

      <Animated.View style={[listStyle, { flex: 1 }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredHistory.length === 0 ? (
            <Card padding-40 br20 bg-white style={{ shadowColor: Colors.grey40, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 }}>
              <View centerH>
                <Text h5 grey70 marginB-12>
                  {history.length === 0 ? 'No fasting history yet' : 'No matching sessions'}
                </Text>
                <Text body2 grey60 center>
                  {history.length === 0 
                    ? 'Start your first fast from the Timer tab to see your progress here.'
                    : 'Try adjusting your search query to find specific fasting sessions.'
                  }
                </Text>
              </View>
            </Card>
          ) : (
            <View>
              {filteredHistory.map((session, index) => (
                <HistoryItem key={session.id} session={session} index={index} />
              ))}
              <View height={40} />
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// All styles are now handled by UI Lib components and theme
