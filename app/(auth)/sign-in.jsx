import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../utils/color";
import { Image } from "expo-image";
import { useAuth } from "@clerk/clerk-expo";
import { SIZES } from "../../utils/dimensions";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [error, setError] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  const sanitizeInput = (text) => text.replace(/\s/g, "");

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setIsLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress.trim().toLowerCase(),
        password: password.trim(),
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        const token = await getToken({ template: "api_access" });

        if (token) {
          await AsyncStorage.clear();
          await AsyncStorage.setItem("token", token);
        }
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      setError(err?.errors?.[0].longMessage);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        enableAutomaticScroll
        showsHorizontalScrollIndicator={false}
        extraScrollHeight={50}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.subContainer}>
          <Image
            source={require("../../assets/images/loginImage.webp")}
            style={styles.loginImage}
          />
          <ScrollView
            style={styles.main}
            contentContainerStyle={{ paddingBottom: 10, flexGrow: 1 }}
          >
            <View style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <Text style={{ fontSize: width * 0.07, fontWeight: 800 }}>
                Welcome Back !
              </Text>
              <Text
                style={{ fontSize: width * 0.05, color: "rgba(0, 0, 0, 0.5)" }}
              >
                Sign in to your account
              </Text>
            </View>

            {/* Input Fields */}
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                width: width * 0.9,
                margin: 10,
                paddingRight: 10,
                gap: 10,
              }}
            >
              {/* Email input */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 6,
                  alignItems: "center",
                  backgroundColor: "white",
                  padding: 5,
                  borderRadius: 20,
                }}
              >
                <Ionicons
                  name="mail-outline"
                  size={width * 0.09}
                  color={error ? "red" : "black"}
                />
                <TextInput
                  value={emailAddress}
                  onChangeText={(text) =>
                    setEmailAddress(sanitizeInput(text).toLowerCase())
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.textInput]}
                  placeholder="Email Address"
                  keyboardType="email-address"
                />
              </View>

              {/* Password input */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 6,
                  alignItems: "center",
                  backgroundColor: "white",
                  padding: 10,
                  borderRadius: 20,
                  position: "relative",
                }}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={width * 0.09}
                  color={error ? "red" : "black"}
                />
                <TextInput
                  value={password}
                  onChangeText={(text) => setPassword(sanitizeInput(text))}
                  secureTextEntry={!showPassword}
                  style={[styles.textInput, { width: "70%", letterSpacing: 2 }]}
                  placeholder="Password"
                  autoCapitalize="none"
                />
                <TouchableWithoutFeedback
                  style={{ position: "absolute" }}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={width * 0.07}
                    color="black"
                    style={{ position: "absolute", right: 20 }}
                  />
                </TouchableWithoutFeedback>
              </View>
            </View>

            <View
              style={{
                display: "flex",
                alignItems: "flex-end",
                marginTop: 2,
                marginRight: 5,
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  console.log("forgot password!");
                }}
              >
                <Text style={{ fontSize: width * 0.05, color: "#407EC7" }}>
                  Forgot password
                </Text>
              </TouchableWithoutFeedback>
            </View>

            <TouchableOpacity
              style={styles.startButton}
              onPress={onSignInPress}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size={"large"} color={"white"} />
              ) : (
                <Text style={styles.startText}>Log In</Text>
              )}
            </TouchableOpacity>

            {/* Error */}
            <View style={{ marginTop: 16 }}>
              {error && (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Ionicons name="warning-outline" size={24} color="red" />
                  <Text style={{ fontSize: width * 0.06, color: "red" }}>
                    {error}
                  </Text>
                </View>
              )}
            </View>

            {/* Sign Up */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontSize: width * 0.05,
                  color: "rgba( 0, 0, 0, 0.5)",
                }}
              >
                Don't have an account ?
              </Text>
              <TouchableWithoutFeedback onPress={() => router.push("/sign-up")}>
                <Text
                  style={{
                    fontSize: width * 0.05,
                    color: "black",
                    fontWeight: "600",
                  }}
                >
                  Sign Up
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.containerPadding,
    padding: 0,
  },
  startButton: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#6CC51D",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginTop: 10,
  },
  startText: {
    fontSize: width * 0.06,
    color: "#fff",
  },
  subContainer: {
    flex: 1,
  },
  loginImage: {
    width,
    height: height * 0.4,
    margin: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  main: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    padding: 18,
  },
  textInput: {
    fontSize: width * 0.05,
    width: "100%",
  },
});
