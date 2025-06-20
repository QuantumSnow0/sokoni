import * as React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../../utils/color";
import { Image } from "expo-image";
import { SIZES } from "../../utils/dimensions";
import { Ionicons } from "@expo/vector-icons";
import { useSignUp, useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import { useUsers } from "../../hooks/useUser";
const { width, height } = Dimensions.get("window");
export default function SignUpScreen() {
  const { registerUser } = useUsers();
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const { user } = useUser();
  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    // Start sign-up process using email and password provided
    if (!phone) return setError("phone number required");
    setLoading(true);
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setError(err?.errors?.[0].longMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        registerUser(emailAddress, emailAddress.split("@")[0], phone);
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setVerifyError(err?.errors?.[0].longMessage);
    }
  };

  if (pendingVerification) {
    return (
      <View
        style={{
          flex: 1,
          padding: SIZES.containerPadding,
        }}
      >
        <KeyboardAwareScrollView
          style={{ flex: 1, backgroundColor: "#f0f0ee" }}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          enableOnAndroid
          enableAutomaticScroll
          extraScrollHeight={50}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("../../assets/images/encrypted.png")}
            alt="logo"
            style={{
              width: width * 0.5,
              height: width * 0.5,
              resizeMode: "contain",
            }}
          />
          {verifyError && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 3,
                alignItems: "center",
                borderWidth: 2,
                padding: 5,
                borderLeftWidth: 10,
                borderRadius: 10,
                borderColor: "red",
                flexWrap: "wrap",
                marginVertical: 5,
              }}
            >
              <Ionicons name="warning" size={22} color={"red"} />
              <Text style={{ color: "red", fontSize: width * 0.04, flex: 1 }}>
                {verifyError}
              </Text>
            </View>
          )}

          <Text
            style={{
              fontSize: width * 0.07,
              fontWeight: 900,
              marginVertical: 7,
            }}
          >
            Verify your email
          </Text>
          <TextInput
            value={code}
            onChangeText={(code) => setCode(code)}
            style={[
              styles.textInput,
              {
                width: "70%",
                letterSpacing: 2,
                borderWidth: 2,
                borderColor: "rgba (0, 0, 0, 0.1)",
                paddingHorizontal: 10,
                borderRadius: 10,
              },
            ]}
            secureTextEntry={!showPassword}
            placeholder="verification code"
          />

          <TouchableOpacity style={styles.startButton} onPress={onVerifyPress}>
            <Text style={styles.startText}>Verify</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    );
  }

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
            source={require("../../assets/images/signupImage.webp")}
            style={styles.loginImage}
          />
          <ScrollView
            style={styles.main}
            contentContainerStyle={{ paddingBottom: 10, flexGrow: 1 }}
          >
            <View style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <Text style={{ fontSize: width * 0.07, fontWeight: 800 }}>
                Create Account
              </Text>
              <Text
                style={{ fontSize: width * 0.05, color: "rgba(0, 0, 0, 0.5)" }}
              >
                Quickly create account
              </Text>
            </View>
            {/* input field */}
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
              {/* email input */}
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
                  onChangeText={setEmailAddress}
                  style={[styles.textInput]}
                  placeholder="Email Address"
                />
              </View>
              {/* phone input */}
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
                  name="call-outline"
                  size={width * 0.09}
                  color={error ? "red" : "black"}
                />
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  style={[styles.textInput]}
                  placeholder="Phone number"
                  keyboardType="numeric"
                />
              </View>
              {/* password input */}
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
                  onChangeText={setPassword}
                  style={[styles.textInput, { width: "70%", letterSpacing: 2 }]}
                  secureTextEntry={!showPassword}
                  placeholder="password"
                />
                <TouchableWithoutFeedback
                  style={{ position: "absolute" }}
                  onPress={() => {
                    setShowPassword(!showPassword);
                  }}
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
            ></View>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
                onSignUpPress();
              }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size={"large"} color={"white"} />
              ) : (
                <Text style={styles.startText}>Create an account</Text>
              )}
            </TouchableOpacity>
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
                style={{ fontSize: width * 0.05, color: "rgba( 0, 0, 0, 0.5)" }}
              >
                {" "}
                Already have an account ?
              </Text>
              <TouchableWithoutFeedback onPress={() => router.push("/sign-in")}>
                <Text
                  style={{
                    fontSize: width * 0.05,
                    color: "rgba( 0, 0, 0, 0.5)",
                    color: "rgba(0, 0, 0)",
                    fontWeight: "600",
                  }}
                >
                  Log In
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
