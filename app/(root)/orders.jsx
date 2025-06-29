import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrdersItem from "../../components/OrdersItem";
import { useOrder } from "../../hooks/useOrders"; // make sure this path is correct

const Orders = () => {
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getToken = async () => {
      const t = await AsyncStorage.getItem("token");
      if (t) {
        setToken(t);
      }
    };
    getToken();
  }, []);

  const { orders, loading, orderError, fetchOrders } = useOrder(token);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
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
        <Text style={{ fontSize: 20, fontWeight: "700" }}>My Orders</Text>
        <TouchableOpacity onPress={() => router.push("/addAddress")}>
          <Ionicons name="add-circle-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#6CC51D"
          style={{ marginTop: 30 }}
        />
      ) : orderError ? (
        <Text style={{ textAlign: "center", color: "red", marginTop: 20 }}>
          {orderError}
        </Text>
      ) : orders.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 30 }}>
          You have no orders yet.
        </Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <OrdersItem data={item} />}
          scrollEnabled={false}
        />
      )}
    </KeyboardAwareScrollView>
  );
};

export default Orders;

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
