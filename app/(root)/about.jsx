import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomInput from "../../components/CustomInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useUsers } from "../../hooks/useUser";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import TypingDotsLoader from "../../components/TypingDotsLoader";
import CustomToast from "../../components/CustomToast"; // ✅ Toast import

const About = () => {
  const router = useRouter();
  const { currentUser, updateUser, isLoading } = useUsers();

  const [editDetails, setEditDetails] = useState({ name: "", phone: "" });
  const [initialDetails, setInitialDetails] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  // ✅ Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      const { name = "", phone = "", email = "" } = currentUser;
      setEditDetails({ name, phone });
      setInitialDetails({ name, phone, email });
      setEmail(email);
    }
  }, [currentUser]);

  const hasChanges =
    editDetails.name.trim() !== initialDetails.name.trim() ||
    editDetails.phone.trim() !== initialDetails.phone.trim();

  const handleSave = async () => {
    const { name, phone } = editDetails;

    if (!name || !phone) {
      setError("Please fill in both name and phone.");
      setToastMessage("Please fill in all fields.");
      setToastVisible(true);
      return;
    }

    try {
      await updateUser(name, phone);
      setInitialDetails({ name, phone, email });
      setError(null);
      setToastMessage("Your profile was updated.");
      setToastVisible(true);
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update profile. Please try again.");
      setToastMessage("Failed to update profile.");
      setToastVisible(true);
    }
  };

  return (
    <>
      {/* ✅ Toast component */}
      <CustomToast
        visible={toastVisible}
        message={toastMessage}
        backgroundColor={error ? "#ff4d4f" : "#4BB543"}
        onClose={() => setToastVisible(false)}
      />

      <View>
        <View style={styles.headerBar}>
          <TouchableWithoutFeedback onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={35}
              color="black"
              style={{ padding: 5 }}
            />
          </TouchableWithoutFeedback>
          <Text style={styles.headerTitle}>About Me</Text>
          <View style={{ padding: 10 }} />
        </View>
      </View>

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={50}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          style={styles.mainView}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <Text style={styles.sectionHeader}>Personal Details</Text>

          <View style={styles.inputGroup}>
            <CustomInput
              icon="person-outline"
              placeholder="Full name"
              value={editDetails.name}
              onChangeText={(text) =>
                setEditDetails((prev) => ({ ...prev, name: text }))
              }
            />
            <CustomInput
              icon="mail-outline"
              placeholder="Email"
              value={email}
              editable={false}
              placeholderTextColor="red"
              textColor="red"
              iconColor="red"
            />
            <CustomInput
              icon="call-outline"
              placeholder="Phone number"
              value={editDetails.phone}
              onChangeText={(text) =>
                setEditDetails((prev) => ({ ...prev, phone: text }))
              }
            />
          </View>

          {error && (
            <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
          )}

          <Text style={styles.sectionHeader}>Change Password</Text>
          <View style={styles.inputGroup}>
            <CustomInput
              icon="lock-closed-outline"
              placeholder="Current password"
              secureTextEntry
            />
            <CustomInput
              icon="lock-closed-outline"
              placeholder="New password"
              secureTextEntry
              isPasswordVisible
            />
            <CustomInput
              icon="lock-closed-outline"
              placeholder="Confirm password"
              secureTextEntry
            />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      <View style={{ padding: 20 }}>
        <TouchableOpacity
          style={[
            {
              backgroundColor: hasChanges ? "#6CC51D" : "#aaa",
              padding: 20,
              borderRadius: 8,
            },
          ]}
          onPress={handleSave}
          disabled={!hasChanges || isLoading}
        >
          {isLoading ? (
            <TypingDotsLoader label="Saving" />
          ) : (
            <Text style={styles.saveText}>Save settings</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default About;

const styles = StyleSheet.create({
  mainView: {
    padding: 20,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    marginBottom: 20,
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 25,
    padding: 10,
    fontWeight: "700",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
  },
  inputGroup: {
    marginVertical: 20,
    display: "flex",
    gap: 5,
  },
  saveText: {
    textAlign: "center",
    fontSize: 17,
    color: "white",
    fontWeight: "900",
  },
});
