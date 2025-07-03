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
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import { useUsers } from "../../hooks/useUser";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const { getToken } = useAuth();

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    if (!phone) return setError("phone number required");
    setLoading(true);
    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      setError(err?.errors?.[0].longMessage);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        const token = await getToken({ template: "api_access" });
        if (token) {
          await AsyncStorage.clear();
          await AsyncStorage.setItem("token", token);
          await registerUser(
            token,
            emailAddress,
            emailAddress.split("@")[0],
            phone
          );
        }
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.log("error verifying user:", err);
      setVerifyError(err?.errors?.[0].longMessage);
    }
  };

  if (pendingVerification) {
    return (
      <View style={{ flex: 1, padding: SIZES.containerPadding }}>
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
            style={{
              width: width * 0.5,
              height: width * 0.5,
              resizeMode: "contain",
            }}
          />
          {verifyError && (
            <View style={styles.errorBox}>
              <Ionicons name="warning" size={22} color={"red"} />
              <Text style={styles.errorText}>{verifyError}</Text>
            </View>
          )}
          <Text style={styles.header}>Verify your email</Text>
          <TextInput
            value={code}
            onChangeText={(text) => setCode(text.replace(/\s/g, ""))}
            style={[styles.textInput, styles.verificationInput]}
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Quickly create account</Text>

            <View style={styles.inputGroup}>
              <View style={styles.inputRow}>
                <Ionicons
                  name="mail-outline"
                  size={width * 0.09}
                  color={error ? "red" : "black"}
                />
                <TextInput
                  value={emailAddress}
                  onChangeText={(text) =>
                    setEmailAddress(text.replace(/\s/g, "").toLowerCase())
                  }
                  style={styles.textInput}
                  placeholder="Email Address"
                />
              </View>
              <View style={styles.inputRow}>
                <Ionicons
                  name="call-outline"
                  size={width * 0.09}
                  color={error ? "red" : "black"}
                />
                <TextInput
                  value={phone}
                  onChangeText={(text) => setPhone(text.replace(/\D/g, ""))}
                  style={styles.textInput}
                  placeholder="Phone number"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputRow, { position: "relative" }]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={width * 0.09}
                  color={error ? "red" : "black"}
                />
                <TextInput
                  value={password}
                  onChangeText={(text) => setPassword(text.replace(/\s/g, ""))}
                  style={[styles.textInput, { width: "70%", letterSpacing: 2 }]}
                  secureTextEntry={!showPassword}
                  placeholder="password"
                />
                <TouchableWithoutFeedback
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

            <TouchableOpacity
              style={styles.startButton}
              onPress={onSignUpPress}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <Text style={styles.startText}>Create an account</Text>
              )}
            </TouchableOpacity>

            {error && (
              <View style={styles.errorBox}>
                <Ionicons name="warning-outline" size={24} color="red" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.bottomTextRow}>
              <Text style={styles.bottomText}>Already have an account?</Text>
              <TouchableWithoutFeedback onPress={() => router.push("/sign-in")}>
                <Text style={styles.loginLink}>Log In</Text>
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
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    width: width * 0.9,
    margin: 10,
    paddingRight: 10,
    gap: 10,
  },
  inputRow: {
    display: "flex",
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    backgroundColor: "white",
    padding: 5,
    borderRadius: 20,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    padding: 5,
    marginTop: 16,
  },
  errorText: {
    fontSize: width * 0.06,
    color: "red",
  },
  bottomTextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    gap: 2,
  },
  bottomText: {
    fontSize: width * 0.05,
    color: "rgba(0, 0, 0, 0.5)",
  },
  loginLink: {
    fontSize: width * 0.05,
    color: "rgba(0, 0, 0)",
    fontWeight: "600",
  },
  header: {
    fontSize: width * 0.07,
    fontWeight: "900",
    marginVertical: 7,
  },
  verificationInput: {
    width: "70%",
    letterSpacing: 2,
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.1)",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: width * 0.05,
    color: "rgba(0, 0, 0, 0.5)",
  },
});
