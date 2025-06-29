import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAddresses } from "../../hooks/useAddresses";
import TypingDotsLoader from "../../components/TypingDotsLoader";
import CustomInput from "../../components/CustomInput";
import CustomSwitch from "../../components/CustomSwitch";
import CustomToast from "../../components/CustomToast";
const AddAddress = () => {
  const [token, setToken] = useState();
  const [isEnabled, setIsEnabled] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const getToken = async () => {
      const t = await AsyncStorage.getItem("token");
      if (t) {
        setToken(t);
      }
    };
    getToken();
  }, []);
  const router = useRouter();
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000); // toast stays visible for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [error]);

  const {
    addresses,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    loading,
  } = useAddresses(token);
  useEffect(() => {
    if (token) {
      fetchAddresses();
    }
  }, [token, fetchAddresses]);
  useEffect(() => {
    setInputAddress((prev) => ({ ...prev, is_default: isEnabled }));
  }, [isEnabled]);

  const [inputAddress, setInputAddress] = useState({
    full_name: "",
    region: "",
    street: "",
    phone: "",
    is_default: isEnabled,
  });
  const handleSave = async () => {
    setError("");
    const isAnyEmpty = Object.values(inputAddress).some(
      (value) => value === ""
    );
    if (isAnyEmpty) return setError("all fields are required");
    await createAddress(inputAddress);
    await fetchAddresses();
    setInputAddress({
      full_name: "",
      region: "",
      street: "",
      phone: "",
      is_default: isEnabled,
    });
    router.push("/address");
  };

  return (
    <>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        enableOnAndroid
        extraScrollHeight={100}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.topView}>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "700" }}> Address</Text>
          <View />
        </View>
        <View style={styles.inputView}>
          <CustomInput
            icon={"person-outline"}
            placeholder="full Name"
            value={inputAddress.fullName}
            onChangeText={(value) =>
              setInputAddress({ ...inputAddress, full_name: value })
            }
          />
          <CustomInput
            icon={"map-outline"}
            placeholder="region"
            onChangeText={(value) =>
              setInputAddress({ ...inputAddress, region: value })
            }
            value={inputAddress.region}
          />
          <CustomInput
            icon={"location-outline"}
            placeholder="street"
            onChangeText={(value) =>
              setInputAddress({ ...inputAddress, street: value })
            }
            value={inputAddress.street}
          />
          <CustomInput
            icon={"call-outline"}
            placeholder="phone"
            onChangeText={(value) =>
              setInputAddress({ ...inputAddress, phone: value })
            }
            value={inputAddress.phone}
            keyboardType="phone-pad"
          />
          <View
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
            }}
          >
            <CustomSwitch
              isOn={isEnabled}
              onToggle={(val) => setIsEnabled(val)}
              onColor="#6CC51D"
              offColor="#ddd"
            />
            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              Make default
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
      {error && (
        <CustomToast
          visible={!!error}
          message={error}
          textColor="white"
          backgroundColor="red"
        />
      )}

      <View>
        <TouchableOpacity
          style={[
            {
              backgroundColor: "#6CC51D",
              padding: 20,
              borderRadius: 8,
              margin: 15,
            },
          ]}
          disabled={loading}
          onPress={handleSave}
        >
          {loading ? (
            <TypingDotsLoader label="Saving" />
          ) : (
            <Text style={styles.saveText}>Save settings</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default AddAddress;

const styles = StyleSheet.create({
  topView: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  saveText: {
    textAlign: "center",
    fontSize: 17,
    color: "white",
    fontWeight: "900",
  },
  inputView: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
});
