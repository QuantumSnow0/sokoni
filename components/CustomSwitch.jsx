import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
} from "react-native";

const CustomSwitch = ({
  isOn = false,
  onToggle = () => {},
  onColor = "#4BB543",
  offColor = "#ccc",
  knobColor = "#fff",
  width = 45,
  height = 26,
  knobSize = 20,
  showText = false,
}) => {
  const [active, setActive] = useState(isOn);
  const translateX = useRef(
    new Animated.Value(isOn ? width - knobSize - 4 : 2)
  ).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: active ? width - knobSize - 4 : 2,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [active]);

  const toggleSwitch = () => {
    setActive((prev) => {
      const newValue = !prev;
      onToggle(newValue);
      return newValue;
    });
  };

  return (
    <TouchableWithoutFeedback onPress={toggleSwitch}>
      <View
        style={[
          styles.container,
          {
            width,
            height,
            borderRadius: height / 2,
            backgroundColor: active ? onColor : offColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.knob,
            {
              width: knobSize,
              height: knobSize,
              borderRadius: knobSize / 2,
              backgroundColor: knobColor,
              transform: [{ translateX }],
            },
          ]}
        />
        {showText && (
          <Text style={[styles.label, { color: active ? "#fff" : "#555" }]}>
            {active ? "ON" : "OFF"}
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 2,
  },
  knob: {
    position: "absolute",
    top: 2,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  label: {
    position: "absolute",
    alignSelf: "center",
    fontWeight: "600",
    fontSize: 12,
  },
});

export default CustomSwitch;
