import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";

const RotatingDotsLoader = ({ size = 80, dotSize = 10, color = "#28B446" }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const dots = Array.from({ length: 6 });

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          width: size,
          height: size,
          transform: [{ rotate: spin }],
        }}
      >
        {dots.map((_, i) => {
          const angle = (i * 360) / dots.length;
          const radius = size / 2.5;
          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);

          return (
            <View
              key={i}
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: color,
                position: "absolute",
                left: size / 2 + x - dotSize / 2,
                top: size / 2 + y - dotSize / 2,
              }}
            />
          );
        })}
      </Animated.View>
    </View>
  );
};

export default RotatingDotsLoader;
