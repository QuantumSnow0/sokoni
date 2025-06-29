import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import CustomLoader from "../../components/CustomLoader";
import { useCart } from "../../hooks/useCart";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ACTION_WIDTH = SCREEN_WIDTH / 4;

export default function CartScreen() {
  const [token, setToken] = useState("");
  const router = useRouter();
  const [subtotal, setSubtotal] = useState(0);
  const SHIPPING = 100;

  const { cart, cartLoading, fetchCart, updateCartItem, deleteCartItem } =
    useCart(token);

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

  useEffect(() => {
    const loadAuth = async () => {
      const t = await AsyncStorage.getItem("token");
      if (t) setToken(t);
    };
    loadAuth();
  }, []);

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const handleIncrease = (item) => {
    updateCartItem(item.id, item.quantity + 1);
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateCartItem(item.id, item.quantity - 1);
    } else {
      deleteCartItem(item.id);
    }
  };

  const renderRightActions = (id) => (
    <TouchableOpacity
      style={[styles.rightAction, { width: ACTION_WIDTH }]}
      onPress={() => deleteCartItem(id)}
    >
      <Ionicons name="trash" size={50} color="white" />
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={35}
            color="black"
            style={{ padding: 5 }}
          />
        </TouchableWithoutFeedback>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <View style={{ padding: 10 }} />
      </View>

      <View style={{ flex: 1 }}>
        {cartLoading ? (
          <View style={styles.loaderContainer}>
            <CustomLoader />
          </View>
        ) : cart.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => router.push("/home")} // Adjust to your home route
            >
              <Text style={styles.shopButtonText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <View style={styles.wrapper}>
                <Swipeable
                  renderRightActions={() => renderRightActions(item.id)}
                >
                  <View style={styles.item}>
                    {/* Left Side */}
                    <View style={styles.leftInfo}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.image}
                      />
                      <View>
                        {item.discount > 0 ? (
                          <View>
                            <Text
                              style={[
                                styles.originalPrice,
                                { textDecorationLine: "line-through" },
                              ]}
                            >
                              Ksh {item.price}
                            </Text>
                            <Text style={styles.price}>
                              Ksh {item.price * (1 - item.discount / 100)}
                            </Text>
                            <Text style={styles.discountTag}>
                              -{item.discount}% OFF
                            </Text>
                          </View>
                        ) : (
                          <Text style={styles.price}>
                            Ksh {Number(item.price || 0)}
                          </Text>
                        )}
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.size}>{item.size}</Text>
                      </View>
                    </View>

                    {/* Right Side (Quantity Controls) */}
                    <View style={styles.qtyControl}>
                      <TouchableOpacity onPress={() => handleIncrease(item)}>
                        <Text style={styles.adjust}>+</Text>
                      </TouchableOpacity>
                      <Text style={{ fontSize: 20 }}>{item.quantity}</Text>
                      <TouchableOpacity onPress={() => handleDecrease(item)}>
                        <Text style={styles.adjust}>-</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Swipeable>
              </View>
            )}
          />
        )}
      </View>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <View style={{ backgroundColor: "white" }}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>Ksh. {subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping Charges</Text>
            <Text style={styles.summaryValue}>Ksh. {SHIPPING}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalLabel}>Ksh. {subtotal + SHIPPING}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              { opacity: cart.length === 0 ? 0.5 : 1 },
            ]}
            onPress={() => router.push("/checkoutScreen")}
          >
            <Text style={styles.saveText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
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
  wrapper: {
    paddingHorizontal: 20,
  },
  item: {
    backgroundColor: "#fff",
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
    overflow: "hidden",
  },
  leftInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  image: {
    width: SCREEN_WIDTH / 6,
    height: SCREEN_WIDTH / 4,
    borderRadius: 10,
  },
  price: {
    color: "#6CC51D",
    fontSize: 15,
    fontWeight: "700",
  },
  originalPrice: {
    fontSize: 14,
    color: "gray",
    fontWeight: "500",
  },
  discountTag: {
    fontSize: 13,
    color: "red",
    fontWeight: "600",
  },
  title: {
    fontSize: 15,
    fontWeight: "900",
  },
  size: {
    fontSize: 17,
    color: "#868889",
  },
  qtyControl: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  adjust: {
    fontSize: 40,
    color: "#6CC51D",
  },
  rightAction: {
    backgroundColor: "red",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  summaryLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(0, 0, 0, 0.5)",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(0, 0, 0, 0.5)",
  },
  divider: {
    width: "90%",
    height: 2,
    marginHorizontal: 18,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "800",
  },
  checkoutButton: {
    backgroundColor: "#6CC51D",
    padding: 20,
    borderRadius: 8,
    margin: 15,
  },
  saveText: {
    textAlign: "center",
    fontSize: 17,
    color: "white",
    fontWeight: "900",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(0, 0, 0, 0.7)",
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: "#6CC51D",
    padding: 15,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
