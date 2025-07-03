import React from "react";
import { View, Text, StyleSheet } from "react-native";

const OrderStatusTracker = ({ steps }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        const isDone = step.status === "done";
        const isFailed = step.status === "failed";

        const dotColor = isFailed ? "#FF4D4F" : isDone ? "#6CC51D" : "#ccc";
        const lineColor = isFailed ? "#FF4D4F" : isDone ? "#6CC51D" : "#ccc";

        return (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.iconColumn}>
              <View style={[styles.circle, { backgroundColor: dotColor }]} />
              {!isLast && (
                <View style={[styles.line, { backgroundColor: lineColor }]} />
              )}
            </View>

            <View style={styles.textRow}>
              <Text style={styles.label}>{step.label}</Text>
              <Text
                style={[
                  styles.date,
                  step.status === "pending" && { color: "gray" },
                  isFailed && { color: "#FF4D4F" },
                ]}
              >
                {step.date === "Pending" ? "Pending" : step.date}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default OrderStatusTracker;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconColumn: {
    alignItems: "center",
    marginRight: 10,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#ccc",
    marginTop: 2,
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: "#ccc",
    marginVertical: 2,
  },
  textRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  label: {
    fontWeight: "600",
    fontSize: 18,
    flex: 1,
  },
  date: {
    fontSize: 16,
    color: "#333",
    minWidth: 80,
    textAlign: "right",
  },
});
