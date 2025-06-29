import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useOrder } from "../../hooks/useOrders";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [token, setToken] = useState("");
  const [showCelebration, setShowCelebration] = useState(true);
  const { singleOrder, fetchOrderById, loading, orderError } = useOrder(token);

  useEffect(() => {
    const loadAuth = async () => {
      const t = await AsyncStorage.getItem("token");
      if (t) setToken(t);
    };
    loadAuth();
  }, []);

  useEffect(() => {
    if (token && orderId) {
      fetchOrderById(orderId);
    }
  }, [token, orderId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowCelebration(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  if (showCelebration) {
    return (
      <View style={styles.loaderContainer}>
        <LottieView
          source={require("../../assets/celebration.json")}
          autoPlay
          loop={false}
          style={{ width: 300, height: 300 }}
        />
        <Text style={styles.successText}>Thank you for your order!</Text>
      </View>
    );
  }

  if (loading || !singleOrder) {
    return (
      <ScrollView style={{ padding: 20 }}>
        <SkeletonPlaceholder borderRadius={4}>
          <SkeletonPlaceholder.Item height={30} width={200} marginBottom={10} />
          {[...Array(3)].map((_, i) => (
            <SkeletonPlaceholder.Item
              key={i}
              flexDirection="row"
              alignItems="center"
              marginBottom={15}
            >
              <SkeletonPlaceholder.Item
                width={60}
                height={80}
                borderRadius={8}
              />
              <SkeletonPlaceholder.Item marginLeft={10}>
                <SkeletonPlaceholder.Item
                  width={120}
                  height={15}
                  marginBottom={6}
                />
                <SkeletonPlaceholder.Item width={180} height={15} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          ))}
        </SkeletonPlaceholder>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="arrow-back" size={35} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Confirmation</Text>
        <View style={{ padding: 10 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.successText}>Thank you for your order!</Text>
        <Text style={styles.orderId}>
          Order ID: {singleOrder.id || orderId}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {singleOrder.items?.map((item, index) => (
          <View key={index} style={styles.item}>
            <Image
              source={{ uri: item.image || "https://via.placeholder.com/60" }}
              style={styles.image}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.title}>{item.title || "Unknown Item"}</Text>
              <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
              <Text style={styles.price}>
                Ksh. {item.price * (1 - (item.discount || 0) / 100)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <Text style={styles.paymentText}>{singleOrder.payment_method}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text>Shipping</Text>
          <Text>Ksh. {singleOrder.shipping_fee || 0}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Total</Text>
          <Text>Ksh. {singleOrder.total_amount}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/home")}
      >
        <Text style={styles.buttonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  headerTitle: { fontSize: 25, fontWeight: "700" },
  section: { padding: 20, backgroundColor: "white", marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  successText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6CC51D",
    textAlign: "center",
  },
  orderId: { fontSize: 14, textAlign: "center", marginTop: 5 },
  item: { flexDirection: "row", marginBottom: 10 },
  image: { width: 60, height: 80, borderRadius: 8, marginRight: 10 },
  itemDetails: { flex: 1 },
  title: { fontSize: 16, fontWeight: "700" },
  quantity: { fontSize: 14, color: "#868889" },
  price: { fontSize: 15, fontWeight: "700", color: "#6CC51D" },
  paymentText: { fontSize: 15 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  button: {
    backgroundColor: "#6CC51D",
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 17, fontWeight: "700" },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
