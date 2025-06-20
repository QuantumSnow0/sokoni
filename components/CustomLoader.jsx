import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";

const CustomLoader = ({
  dotColor = "#28B446",
  dotSize = 12,
  dotSpacing = 8,
}) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -10,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = animateDot(dot1, 0);
    const anim2 = animateDot(dot2, 150);
    const anim3 = animateDot(dot3, 300);

    anim1.start();
    anim2.start();
    anim3.start();
  }, []);

  return (
    <View style={[styles.container, { gap: dotSpacing }]}>
      {[dot1, dot2, dot3].map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              backgroundColor: dotColor,
              transform: [{ translateY: anim }],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  dot: {
    borderRadius: 50,
  },
});

export default CustomLoader;
