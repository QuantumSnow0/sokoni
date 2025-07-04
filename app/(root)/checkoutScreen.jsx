import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomLoader from "../../components/CustomLoader";
import { useCart } from "../../hooks/useCart";
import { useAddresses } from "../../hooks/useAddresses";
import { useOrder } from "../../hooks/useOrders";
import { useUsers } from "../../hooks/useUser";
import { Picker } from "@react-native-picker/picker";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function CheckoutScreen() {
  const [token, setToken] = useState("");
  const router = useRouter();
  const { cart, cartLoading, clearCart, fetchCart } = useCart(token);
  const {
    addresses,
    fetchAddresses,
    createAddress,
    loading: addressLoading,
  } = useAddresses(token);
  const { createOrder, loading: orderLoading, orderError } = useOrder(token);
  const { currentUser, isLoading: userLoading } = useUsers();

  const [subtotal, setSubtotal] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState({
    full_name: "",
    region: "",
    street: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const SHIPPING = 0;

  useEffect(() => {
    const loadAuth = async () => {
      const t = await AsyncStorage.getItem("token");
      if (t) setToken(t);
    };
    loadAuth();
  }, []);

  useEffect(() => {
    if (token) {
      fetchAddresses();
      fetchCart();
    }
  }, [token]);

  useEffect(() => {
    if (!cart || cart.length === 0) {
      setSubtotal(0);
      return;
    }
    const newSubtotal = cart.reduce((acc, item) => {
      const discountMultiplier = 1 - (item.discount || 0) / 100;
      return acc + item.price * discountMultiplier * item.quantity;
    }, 0);
    setSubtotal(newSubtotal);
  }, [cart]);

  const handleAddressChange = (field, value) => {
    setNewAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAddress = async () => {
    const { full_name, region, street, phone } = newAddress;
    if (!full_name || !region || !street || !phone) {
      alert("Please fill in all address fields");
      return;
    }
    try {
      await createAddress(newAddress);
      setShowAddAddress(false);
      setNewAddress({ full_name: "", region: "", street: "", phone: "" });
      fetchAddresses();
    } catch (err) {
      alert("Failed to save address: " + err.message);
    }
  };

  const handleCheckout = async () => {
    console.log("am here");
    if (!selectedAddress) {
      alert("Please select or add a shipping address");
      return;
    }
    console.log("Shipping address ID sent to backend:", selectedAddress);
    try {
      const response = await createOrder({
        shipping_address: selectedAddress,
        shipping_fee: SHIPPING,
        payment_method: paymentMethod,
      });

      console.log("Checkout response:", response);

      if (response && response.orderId) {
        await clearCart();
        router.push({
          pathname: "/order-confirmation",
          params: { orderId: response.orderId },
        });
      } else {
        alert("Order creation failed: No order ID returned");
      }
    } catch (err) {
      alert("Checkout failed: " + (orderError || err.message));
    }
  };

  if (cartLoading || addressLoading || userLoading || orderLoading) {
    return (
      <View style={styles.loaderContainer}>
        <CustomLoader />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={35}
            color="black"
            style={{ padding: 5 }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ padding: 10 }} />
      </View>

      {cart.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              Ksh. {subtotal.toFixed(0)}.00
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              Ksh. {SHIPPING.toFixed(0)}.00
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalLabel}>
              Ksh. {(subtotal + SHIPPING).toFixed(0)}.00
            </Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        {addresses.length > 0 ? (
          <Picker
            selectedValue={selectedAddress}
            onValueChange={(value) => setSelectedAddress(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select an address" value="" />
            {addresses.map((addr) => (
              <Picker.Item
                key={addr.id}
                label={`${addr.full_name}, ${addr.region}, ${addr.street}, ${addr.phone}`}
                value={addr.id} // ✅ UUID goes here
              />
            ))}
          </Picker>
        ) : (
          <Text style={styles.noAddressText}>
            No addresses found. Add one below.
          </Text>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddAddress(!showAddAddress)}
        >
          <Text style={styles.addButtonText}>
            {showAddAddress ? "Cancel" : "Add New Address"}
          </Text>
        </TouchableOpacity>

        {showAddAddress && (
          <View style={styles.addressForm}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={newAddress.full_name}
              onChangeText={(text) => handleAddressChange("full_name", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Region"
              value={newAddress.region}
              onChangeText={(text) => handleAddressChange("region", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Street"
              value={newAddress.street}
              onChangeText={(text) => handleAddressChange("street", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={newAddress.phone}
              onChangeText={(text) => handleAddressChange("phone", text)}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveAddress}
            >
              <Text style={styles.saveText}>Save Address</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <Picker
          selectedValue={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value)}
          style={styles.picker}
        >
          <Picker.Item label="Cash on Delivery" value="cash" />
        </Picker>
      </View>

      {orderError && <Text style={styles.errorText}>{orderError}</Text>}

      <TouchableOpacity
        style={[
          styles.checkoutButton,
          { opacity: cart.length === 0 || !selectedAddress ? 0.5 : 1 },
        ]}
        onPress={handleCheckout}
        disabled={cart.length === 0 || !selectedAddress}
      >
        <Text style={styles.saveText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "white",
  },
  headerTitle: { fontSize: 25, padding: 10, fontWeight: "700" },
  section: { backgroundColor: "white", padding: 20, marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  summaryLabel: { fontSize: 15, fontWeight: "600", color: "rgba(0,0,0,0.5)" },
  summaryValue: { fontSize: 15, fontWeight: "500", color: "rgba(0,0,0,0.5)" },
  divider: {
    width: "100%",
    height: 2,
    backgroundColor: "rgba(0,0,0,0.2)",
    marginVertical: 10,
  },
  totalLabel: { fontSize: 20, fontWeight: "800" },
  picker: { height: 50, width: "100%", marginBottom: 10 },
  noAddressText: { fontSize: 15, color: "gray", marginBottom: 10 },
  addButton: {
    backgroundColor: "#6CC51D",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "white", fontSize: 16, fontWeight: "700" },
  addressForm: { marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#6CC51D",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  saveText: {
    textAlign: "center",
    fontSize: 17,
    color: "white",
    fontWeight: "900",
  },
  checkoutButton: {
    backgroundColor: "#6CC51D",
    padding: 20,
    borderRadius: 8,
    margin: 15,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 15,
    textAlign: "center",
    marginVertical: 10,
  },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
