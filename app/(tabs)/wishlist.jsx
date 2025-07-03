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
import { useCart } from "../../hooks/useCart";
import { useWishList } from "../../hooks/useWishlist";
import CustomToast from "../../components/CustomToast";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ACTION_WIDTH = SCREEN_WIDTH / 4;

export default function Wishlist() {
  const [token, setToken] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [localCart, setLocalCart] = useState([]);
  const router = useRouter();

  const { wishlist, isLoading, fetchWishlist, createWishList } =
    useWishList(token);
  const { cart, fetchCart, addToCart, updateCartItem, deleteCartItem } =
    useCart(token);

  // Load token
  useEffect(() => {
    const loadAuth = async () => {
      const t = await AsyncStorage.getItem("token");
      if (t) setToken(t);
    };
    loadAuth();
  }, []);

  // Fetch wishlist and cart
  useEffect(() => {
    if (token) {
      fetchWishlist();
      fetchCart();
    }
  }, [token]);

  // Reflect cart in local state
  useEffect(() => {
    if (cart) {
      setLocalCart(cart);
    }
  }, [cart]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  const handleCart = (product) => {
    const cartItem = localCart.find((p) => p.product_id === product.id);

    if (product.stock < 1) {
      showToast("❌ Out of stock");
      return;
    }

    if (cartItem && cartItem.quantity >= product.stock) {
      showToast("❌ Stock limit reached");
      return;
    }

    const newQty = cartItem ? cartItem.quantity + 1 : 1;

    // Update UI instantly
    const newCart = cartItem
      ? localCart.map((p) =>
          p.product_id === product.id ? { ...p, quantity: newQty } : p
        )
      : [...localCart, { product_id: product.id, quantity: 1 }];
    setLocalCart(newCart);

    showToast("✔️ Added to cart");

    // Update backend quietly
    if (cartItem) {
      updateCartItem(cartItem.id, newQty);
    } else {
      addToCart(product.id);
    }
  };

  const handleDecrease = (product) => {
    const cartItem = localCart.find((p) => p.product_id === product.id);
    if (!cartItem) return;

    if (cartItem.quantity > 1) {
      const newQty = cartItem.quantity - 1;
      setLocalCart(
        localCart.map((p) =>
          p.product_id === product.id ? { ...p, quantity: newQty } : p
        )
      );
      updateCartItem(cartItem.id, newQty);
    } else {
      setLocalCart(localCart.filter((p) => p.product_id !== product.id));
      deleteCartItem(cartItem.id);
    }
  };

  const renderRightActions = (id) => (
    <TouchableOpacity
      style={[styles.rightAction, { width: ACTION_WIDTH }]}
      onPress={() => createWishList(id)}
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
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={{ padding: 10 }} />
      </View>

      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => {
          const cartItem = localCart.find((p) => p.product_id === item.id);
          return (
            <View style={styles.wrapper}>
              <Swipeable renderRightActions={() => renderRightActions(item.id)}>
                <View style={styles.item}>
                  <View style={styles.leftWing}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <View>
                      <Text style={styles.price}>ksh {item.price}</Text>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.size}>{item.size}</Text>
                    </View>
                  </View>

                  <View style={styles.rightWing}>
                    {cartItem ? (
                      <>
                        <TouchableOpacity onPress={() => handleCart(item)}>
                          <Text style={styles.adjust}>+</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20 }}>
                          {cartItem.quantity}
                        </Text>
                        <TouchableOpacity onPress={() => handleDecrease(item)}>
                          <Text style={styles.adjust}>-</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity onPress={() => handleCart(item)}>
                        <Ionicons
                          name="add-circle-outline"
                          size={30}
                          color="green"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </Swipeable>
            </View>
          );
        }}
      />

      <CustomToast
        visible={toastVisible}
        message={toastMessage}
        onClose={() => setToastVisible(false)}
      />
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
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  leftWing: {
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
  title: {
    fontSize: 15,
    fontWeight: "900",
  },
  size: {
    fontSize: 17,
    color: "#868889",
  },
  rightWing: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  adjust: {
    fontSize: 30,
    color: "#6CC51D",
  },
  rightAction: {
    backgroundColor: "red",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
