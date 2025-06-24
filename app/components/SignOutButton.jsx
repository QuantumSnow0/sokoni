import { useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const SignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Clear specific auth data from AsyncStorage
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");

      await signOut();
      router.push("(auth)/sign-in");
    } catch (err) {
      console.error("Sign-out error:", err);
    }
  };

  return (
    <TouchableOpacity onPress={handleSignOut} style={styles.container}>
      <Ionicons name="log-out-outline" size={30} color="#28B446" />
      <Text style={{ fontSize: 20, fontWeight: "600" }}>Sign out</Text>
    </TouchableOpacity>
  );
};

export default SignOutButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
    marginLeft: 25,
  },
});
