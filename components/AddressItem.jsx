import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import CustomInput from "./CustomInput";
import CustomSwitch from "./CustomSwitch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAddresses } from "../hooks/useAddresses";

const AddressItem = ({ data }) => {
  const [token, setToken] = useState("");
  useEffect(() => {
    const getToken = async () => {
      const t = await AsyncStorage.getItem("token");
      if (t) setToken(t);
    };
    getToken();
  }, []);
  const {
    addresses,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    loading,
  } = useAddresses(token);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isDisplayed, setIsDisplayed] = useState(false);
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);
  return (
    <View style={{ paddingTop: 30, paddingHorizontal: 15 }}>
      <View style={styles.defaultV}>
        <View>
          {data.is_default && (
            <Text
              style={{
                alignSelf: "flex-start",
                backgroundColor: "rgba(108, 197, 29, 0.1)",
                color: "#6cc51d",
                fontWeight: "800",
              }}
            >
              DEFAULT
            </Text>
          )}
        </View>
        <View style={styles.defaultContainer}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(108, 197, 29, 0.1)",
                borderRadius: 999,
              }}
            >
              <Ionicons
                name="location-outline"
                size={40}
                color="#6cc51d"
                style={{
                  margin: 10,
                  padding: 5,
                }}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 2,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "700" }}>
                {data.full_name}
              </Text>
              <Text style={{ fontSize: 15, color: "#868889" }}>
                {data.region}
              </Text>
              <Text style={{ fontSize: 15, color: "#868889" }}>
                {data.street}
              </Text>
              <Text style={{ fontSize: 15, fontWeight: "700" }}>
                {data.phone}
              </Text>
            </View>
          </View>
          <View>
            <TouchableOpacity onPress={() => setIsDisplayed(!isDisplayed)}>
              <Ionicons
                name={
                  isDisplayed
                    ? "caret-up-circle-outline"
                    : "caret-down-circle-outline"
                }
                size={24}
                color="#6cc51d"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {isDisplayed && (
        <View style={styles.inputField}>
          <View style={styles.innerField}>
            <CustomInput
              icon={"person-circle-outline"}
              placeholder="Name"
              colour="rgba(0, 0, 0, 0.1)"
              iconColor="rgba(0, 0, 0, 0.5)"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
            <CustomInput
              icon={"location-outline"}
              placeholder="Address"
              colour="rgba(0, 0, 0, 0.1)"
              iconColor="rgba(0, 0, 0, 0.5)"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
            <CustomInput
              icon={"map-outline"}
              placeholder="City"
              colour="rgba(0, 0, 0, 0.1)"
              iconColor="rgba(0, 0, 0, 0.5)"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
            <CustomInput
              icon={"call-outline"}
              placeholder="Phone Number"
              colour="rgba(0, 0, 0, 0.1)"
              iconColor="rgba(0, 0, 0, 0.5)"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
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
        </View>
      )}
    </View>
  );
};

export default AddressItem;

const styles = StyleSheet.create({
  defaultContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  defaultV: {
    backgroundColor: "#fff",
  },
  inputField: {
    backgroundColor: "#fff",
    marginTop: 5,
  },
  innerField: {
    padding: 15,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
});
