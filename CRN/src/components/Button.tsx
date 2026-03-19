import React from 'react';
import { Animated } from 'react-native';
import { Button, ButtonProps } from '@ui-kitten/components';

export default function AnimatedButton(props: ButtonProps) {
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
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Button
        {...props}
        onPressIn={pressIn}
        onPressOut={pressOut}
      />
    </Animated.View>
  );
}