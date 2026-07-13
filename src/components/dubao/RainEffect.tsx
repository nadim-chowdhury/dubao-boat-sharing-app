import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const DROP_COUNT = 35;

interface RainDropProps {
  index: number;
}

const RainDrop: React.FC<RainDropProps> = ({ index }) => {
  // Randomize initial position
  const leftPos = useState(() => Math.random() * SCREEN_WIDTH)[0];
  const dropHeight = useState(() => Math.random() * 15 + 15)[0];
  const speed = useState(() => Math.random() * 800 + 700)[0]; // ms
  const delay = useState(() => Math.random() * 1000)[0];
  const opacity = useState(() => Math.random() * 0.3 + 0.15)[0];

  const translateY = useSharedValue(-50);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(SCREEN_HEIGHT + 50, {
        duration: speed,
        easing: Easing.linear,
      }),
      -1, // Infinite repeat
      false // Do not reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.drop,
        {
          left: leftPos,
          height: dropHeight,
          opacity: opacity,
        },
        animatedStyle,
      ]}
    />
  );
};

export const RainEffect: React.FC = () => {
  const [drops, setDrops] = useState<number[]>([]);

  useEffect(() => {
    // Fill drops array
    setDrops(Array.from({ length: DROP_COUNT }, (_, i) => i));
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {drops.map((i) => (
        <RainDrop key={i} index={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  drop: {
    position: 'absolute',
    width: 1,
    backgroundColor: '#00B4D8',
    borderRadius: 1,
  },
});
