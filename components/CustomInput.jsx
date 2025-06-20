import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const CustomInput = ({ isPassword = false, icon, placeholder }) => {
  return (
    <View style={styles.header}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Ionicons name={icon} size={24} color="black" />
        <TextInput placeholder={placeholder} style={{ width: "80%" }} />
      </View>
      {isPassword ? (
        <TouchableOpacity>
          <Ionicons name="eye-outline" size={24} color="black" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    backgroundColor: "white",
    padding: 10,
  },
});
