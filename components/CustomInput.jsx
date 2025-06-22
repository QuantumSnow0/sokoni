import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const CustomInput = ({
  isPasswordVisible = false,
  icon,
  placeholder,
  secureTextEntry = false,
  editable = true,
  colour = "white",
  iconColor = "black",
  placeholderTextColor = "gray",
  textColor = "black",
  onChangeText = { onChangeText },
  value = { value },
}) => {
  const [hidePassword, setHidePassword] = useState(true);
  return (
    <View style={[styles.header, { backgroundColor: colour }]}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Ionicons name={icon} size={24} color={iconColor} />
        <TextInput
          placeholder={placeholder}
          style={{
            width: "80%",
            fontSize: 17,
            overflow: "hidden",
            flexWrap: "wrap",
            color: textColor,
          }}
          numberOfLines={1}
          secureTextEntry={secureTextEntry && hidePassword}
          editable={editable}
          placeholderTextColor={placeholderTextColor}
          onChangeText={onChangeText}
          value={value}
        />
      </View>
      {isPasswordVisible ? (
        <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
            size={24}
            color={iconColor}
          />
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
    padding: 10,
  },
});
