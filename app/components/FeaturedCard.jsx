import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useCart } from "../../hooks/useCart";
import TypingDotsLoader from "../../components/TypingDotsLoader";

const { width } = Dimensions.get("window");

const FeaturedCard = ({
  item,
  wishlist,
  createWishList,
  width: cardWidth,
  onAddToCartToast,
}) => {
  const [like, setLike] = useState(false);
  const [token, setToken] = useState("");
  const [adding, setAdding] = useState(false);
  const [cartProduct, setCartProduct] = useState(null);
  const [isCart, setIsCart] = useState(false);

  const {
    cart,
    cartLoading,
    fetchCart,
    addToCart,
    updateCartItem,
    deleteCartItem,
  } = useCart(token);

  useEffect(() => {
    const getToken = async () => {
      const t = await AsyncStorage.getItem("token");
      if (t) {
        setToken(t);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  useEffect(() => {
    const inCart = cart.some((p) => p.product_id === item.id);
    setIsCart(inCart);

    const current = cart.find((p) => p.product_id === item.id);
    setCartProduct(current || null);
  }, [cart, item.id]);

  useEffect(() => {
    const isInWishlist = wishlist.some((product) => product.id === item.id);
    setLike(isInWishlist);
  }, [wishlist, item.id]);

  const addToWishList = async () => {
    setLike(!like);
    await createWishList(item.id);
  };

  const handleCart = async (product) => {
    if (product.stock < 1) {
      onAddToCartToast?.("❌ Out of stock!");
      return;
    }

    setAdding(true);

    const tempCartProduct = {
      id: "temp",
      product_id: product.id,
      quantity: 1,
    };

    setCartProduct(tempCartProduct);
    setIsCart(true);

    try {
      await addToCart(product.id);
      onAddToCartToast?.(`✅ ${product.title} added to cart`);
    } catch (error) {
      console.log("❌ Error adding to cart:", error);
      setIsCart(false);
      setCartProduct(null);
      onAddToCartToast?.("❌ Failed to add. Try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleDecrease = () => {
    if (cartProduct?.quantity > 1) {
      const newQty = cartProduct.quantity - 1;
      setCartProduct({ ...cartProduct, quantity: newQty });
      updateCartItem(cartProduct.id, newQty).catch(() =>
        onAddToCartToast?.("❌ Failed to update cart")
      );
    } else {
      deleteCartItem(cartProduct.id).then(() => {
        setCartProduct(null);
        setIsCart(false);
      });
    }
  };

  const handleIncrease = () => {
    if (cartProduct?.quantity >= item.stock) {
      onAddToCartToast?.("❌ Cannot add more — stock limit reached.");
      return;
    }

    const newQty = cartProduct.quantity + 1;
    setCartProduct({ ...cartProduct, quantity: newQty });

    updateCartItem(cartProduct.id, newQty).catch(() => {
      onAddToCartToast?.("❌ Failed to update cart");
    });
  };

  return (
    <TouchableOpacity style={[styles.card, { width: cardWidth }]}>
      <View style={styles.container}>
        {item.discount !== 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{item.discount}%</Text>
          </View>
        )}

        <View style={{ padding: 7 }}>
          <TouchableOpacity
            onPress={addToWishList}
            style={{ alignSelf: "flex-end" }}
          >
            <Ionicons
              name={like ? "heart-sharp" : "heart-outline"}
              size={27}
              color={like ? "#FE585A" : "black"}
            />
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center" }}>
          <Image
            source={{ uri: item.image }}
            style={{ width: width * 0.3, height: width * 0.2 }}
            contentFit="contain"
          />
        </View>

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={styles.price}>ksh {item.price}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.size}>{item.size}</Text>
        </View>

        <View style={styles.addToCartContainer}>
          {isCart ? (
            <View style={styles.cartItem}>
              <TouchableOpacity onPress={handleDecrease}>
                <Text
                  style={[styles.cartText, { fontSize: 40, color: "green" }]}
                >
                  -
                </Text>
              </TouchableOpacity>
              <Text style={styles.cartText}>{cartProduct?.quantity ?? 1}</Text>
              <TouchableOpacity onPress={handleIncrease}>
                <Text
                  style={[styles.cartText, { fontSize: 40, color: "green" }]}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
          ) : adding ? (
            <View style={styles.addToCartButton}>
              <TypingDotsLoader label="Adding" textColor="green" />
            </View>
          ) : item.stock === 0 || item.stock < 1 ? (
            <View style={styles.addToCartButton}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "red",
                  textDecorationLine: "line-through",
                }}
              >
                Out of stock
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => handleCart(item)}
            >
              <Ionicons name="bag-handle-outline" size={24} color="#6CC51D" />
              <Text style={{ fontSize: 15, fontWeight: "700" }}>
                Add to cart
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FeaturedCard;

const styles = StyleSheet.create({
  card: {
    height: width * 0.7,
    elevation: 5,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    position: "relative",
    flexDirection: "column",
  },
  discountBadge: {
    position: "absolute",
    backgroundColor: "rgba(245, 98, 98, 0.5)",
  },
  discountText: {
    padding: 4,
    paddingHorizontal: 10,
    color: "#fc4c4c",
    fontWeight: "900",
  },
  price: {
    fontSize: 15,
    fontWeight: "800",
    color: "#6CC51D",
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    textTransform: "capitalize",
    overflow: "hidden",
    maxWidth: 150,
  },
  size: {
    fontSize: 15,
    color: "rgba(0, 0, 0, 0.6)",
  },
  addToCartContainer: {
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.5)",
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
  },
  cartItem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 1,
  },
  cartText: {
    fontSize: 25,
    fontWeight: "700",
  },
});
