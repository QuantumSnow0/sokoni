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
import { useWishList } from "../../hooks/useWishlist";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ACTION_WIDTH = SCREEN_WIDTH / 4;

export default function Wishlist() {
  const [token, setToken] = useState("");
  const [loadingItemId, setLoadingItemId] = useState(null); // loader state
  const router = useRouter();

  const { wishlist, isLoading, fetchWishlist, createWishList } =
    useWishList(token);
  const { cart, fetchCart, addToCart, updateCartItem, deleteCartItem } =
    useCart(token);

  useEffect(() => {
    const loadAuth = async () => {
      const t = await AsyncStorage.getItem("token");
      if (t) setToken(t);
    };
    loadAuth();
  }, []);

  useEffect(() => {
    if (token) {
      fetchWishlist();
      fetchCart();
    }
  }, [token]);

  const handleCart = async (product) => {
    setLoadingItemId(product.id);

    const cartItem = cart?.find((p) => p.product_id === product.id);

    if (cartItem) {
      await updateCartItem(cartItem.id, cartItem.quantity + 1);
    } else {
      await addToCart(product.id);
    }

    await fetchCart();
    setLoadingItemId(null);
  };

  const handleDecrease = async (product) => {
    const cartItem = cart?.find((p) => p.product_id === product.id);
    if (cartItem?.quantity > 1) {
      await updateCartItem(cartItem.id, cartItem.quantity - 1);
    } else {
      await deleteCartItem(cartItem.id);
    }
    fetchCart();
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

      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View style={{ marginTop: 10 }}>
            <CustomLoader />
          </View>
        ) : (
          <FlatList
            data={wishlist}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => {
              const cartItem = cart?.find((p) => p.product_id === item.id);
              return (
                <View style={styles.wrapper}>
                  <Swipeable
                    renderRightActions={() => renderRightActions(item.id)}
                  >
                    <View style={styles.item}>
                      <View style={styles.leftWing}>
                        <Image
                          source={{ uri: item.image }}
                          style={styles.image}
                        />
                        <View>
                          <Text style={styles.price}>ksh {item.price}</Text>
                          <Text style={styles.title}>{item.title}</Text>
                          <Text style={styles.size}>{item.size}</Text>
                        </View>
                      </View>

                      <View style={styles.rightWing}>
                        {loadingItemId === item.id ? (
                          <CustomLoader size={20} />
                        ) : cartItem ? (
                          <>
                            <TouchableOpacity onPress={() => handleCart(item)}>
                              <Text style={styles.adjust}>+</Text>
                            </TouchableOpacity>
                            <Text style={{ fontSize: 20 }}>
                              {cartItem.quantity}
                            </Text>
                            <TouchableOpacity
                              onPress={() => handleDecrease(item)}
                            >
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
        )}
      </View>
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
