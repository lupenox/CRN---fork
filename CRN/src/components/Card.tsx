import React from 'react';
import { Animated } from 'react-native';
import { Card, CardProps } from '@ui-kitten/components';

export default function AnimatedCard(props: CardProps) {
  const scale = React.useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.93,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Card
        {...props}
        onPressIn={pressIn}
        onPressOut={pressOut}
      >
        {props.children}
      </Card>
    </Animated.View>
  );
}