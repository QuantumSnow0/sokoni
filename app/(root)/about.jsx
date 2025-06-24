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

  // ✅ Password fields
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

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

  const changePassword = async () => {
    if (!current || !newPass || !confirmPass) {
      setError("Please fill in all password fields.");
      setToastMessage("All fields are required.");
      setToastVisible(true);
      return;
    }

    if (newPass !== confirmPass) {
      setError("New password and confirm password do not match.");
      setToastMessage("Passwords do not match.");
      setToastVisible(true);
      return;
    }

    try {
      await currentUser.updatePassword({
        currentPassword: current,
        newPassword: newPass,
        signOutOfOtherSessions: true,
      });

      setError(null);
      setToastMessage("Password changed successfully.");
      setToastVisible(true);

      setCurrent("");
      setNewPass("");
      setConfirmPass("");
    } catch (err) {
      console.error("Change password error:", err);
      setError("Incorrect current password or weak new password.");
      setToastMessage("Failed to change password.");
      setToastVisible(true);
    }
  };

  return (
    <>
      <CustomToast
        visible={toastVisible}
        message={toastMessage}
        backgroundColor={error ? "#ff4d4f" : "#4BB543"}
        onClose={() => {
          setToastVisible(false);
          setError(null);
        }}
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
              value={current}
              onChangeText={setCurrent}
            />
            <CustomInput
              icon="lock-closed-outline"
              placeholder="New password"
              secureTextEntry={true}
              value={newPass}
              onChangeText={setNewPass}
            />
            <CustomInput
              icon="lock-closed-outline"
              placeholder="Confirm password"
              secureTextEntry
              value={confirmPass}
              onChangeText={setConfirmPass}
            />
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: "#6CC51D",
              padding: 15,
              borderRadius: 8,
              marginTop: 10,
            }}
            onPress={changePassword}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Change Password
            </Text>
          </TouchableOpacity>
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
