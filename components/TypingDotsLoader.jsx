import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";

const TypingDotsLoader = ({
  label = "Fetching data",
  dotColor = "#28B446",
  textColor = "#333",
  speed = 500,
}) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, speed);
    return () => clearInterval(interval);
  }, [speed]);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: textColor }]}>
        {label}
        <Text style={{ color: dotColor }}>{dots}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
  },
});

export default TypingDotsLoader;
