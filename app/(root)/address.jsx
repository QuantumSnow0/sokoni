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
import AddressItem from "../../components/AddressItem";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAddresses } from "../../hooks/useAddresses";
import TypingDotsLoader from "../../components/TypingDotsLoader";
const Address = () => {
  const [token, setToken] = useState();
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
          <Text style={{ fontSize: 20, fontWeight: "700" }}>My Address</Text>
          <TouchableOpacity onPress={() => router.push("/addAddress")}>
            <Ionicons name="add-circle-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={addresses}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <AddressItem data={item} />}
          scrollEnabled={false} // since parent handles scroll
        />
      </KeyboardAwareScrollView>
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

export default Address;

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
});
