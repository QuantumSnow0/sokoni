import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import CustomToast from "../../components/CustomToast";

const { width } = Dimensions.get("window");

const FeaturedCard = ({ item, wishlist, createWishList }) => {
  const [like, setLike] = useState(false);

  // Sync `like` state with actual wishlist contents
  useEffect(() => {
    const isInWishlist = wishlist.some((product) => product.id === item.id);
    setLike(isInWishlist);
  }, [wishlist, item.id]);

  const addToWishList = async () => {
    setLike(!like);
    await createWishList(item.id);
  };

  return (
    <View style={styles.card}>
      <View style={styles.container}>
        {/* Discount Badge */}
        {item.discount !== 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{item.discount}%</Text>
          </View>
        )}

        {/* Heart Button */}
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

        {/* Product Image */}
        <View style={{ display: "flex", alignItems: "center" }}>
          <Image
            source={{ uri: item.image }}
            style={{ width: width * 0.3, height: width * 0.2 }}
            contentFit="contain"
          />
        </View>

        {/* Product Info */}
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={styles.price}>ksh {item.price}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.size}>{item.size}</Text>
        </View>

        {/* Add to Cart Button */}
        <View style={styles.addToCartContainer}>
          <TouchableOpacity style={styles.addToCartButton}>
            <Ionicons name="bag-handle-outline" size={24} color="#6CC51D" />
            <Text style={{ fontSize: 15, fontWeight: "700" }}>Add to cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FeaturedCard;

const styles = StyleSheet.create({
  card: {
    width: width * 0.4,
    height: width * 0.7,
    elevation: 5,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
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
});
