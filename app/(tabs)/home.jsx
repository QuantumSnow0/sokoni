import { SignedIn, SignedOut, useUser, useAuth } from "@clerk/clerk-expo";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
  Entypo,
  Feather,
} from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useRef } from "react";
import FeaturedCard from "../components/FeaturedCard";
import { useProducts } from "../../hooks/useProducts";
import { useWishList } from "../../hooks/useWishlist";
import { usePushNotifications } from "../../hooks/usePushNotifications";
import CustomToast from "../../components/CustomToast";
import { useCart } from "../../hooks/useCart";
import * as Notifications from "expo-notifications";
import LottieView from "lottie-react-native";
import { useCategories } from "../../hooks/useCategories"; // ✅ using categories hook

const { width, height } = Dimensions.get("window");
const cardSpacing = 20;
const cardWidth = (width - cardSpacing * 3) / 2;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const iconLibraries = {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
  Entypo,
  Feather,
};

function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function HomeScreen() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { categories } = useCategories(); // ✅ live categories
  const [token, setToken] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const bannerRef = useRef(null);
  const animationRef = useRef(null);
  const [showLottie, setShowLottie] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { expoPushToken } = usePushNotifications();
  const { wishlist, createWishList, fetchWishlist } = useWishList(token);
  const { products, isLoading, fetchProducts } = useProducts(token);
  const { cart, fetchCart, addToCart, updateCartItem, deleteCartItem } =
    useCart(token);

  const banners = [
    {
      id: 1,
      uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBtOw6VtgKsrKNXkcFy73IHWX8tocwQMrMvViLGOLfEDxv_IFiC9Hohdc&s=10",
    },
    {
      id: 2,
      uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBtOw6VtgKsrKNXkcFy73IHWX8tocwQMrMvViLGOLfEDxv_IFiC9Hohdc&s=10",
    },
    {
      id: 3,
      uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz8SdAoMG781gf0zI_n2D0W8DSjnUIjcaKbQ&usqp=CAU",
    },
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  useEffect(() => {
    const storeUserId = async () => {
      const getUserId = await AsyncStorage.getItem("userId");
      if (!getUserId && user?.id) {
        await AsyncStorage.setItem("userId", user.id);
      }
    };
    storeUserId();
  }, [user]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const reqToken = await getToken({ template: "api_access" });
        if (reqToken) setToken(reqToken);
      } catch (error) {
        console.error("Failed to fetch token:", error);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchProducts();
      fetchCart();
      fetchWishlist();
    }
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % banners.length;
        bannerRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLottie(false);
    }, 2500);
    return () => clearTimeout(timeout);
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title
      ?.toLowerCase()
      .includes(debouncedSearch.toLowerCase());
    const matchesCategory = selectedCategory
      ? p.category?.toLowerCase() === selectedCategory.toLowerCase()
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={{ flex: 1 }}>
      {showLottie && (
        <View style={StyleSheet.absoluteFill}>
          <LottieView
            ref={animationRef}
            source={require("../../assets/celebration.json")}
            autoPlay
            loop={false}
            resizeMode="cover"
          />
        </View>
      )}

      <CustomToast visible={toastVisible} message={toastMessage} />

      {/* 🔍 Search */}
      <View style={styles.fixedSearch}>
        <View style={styles.searchIcon}>
          <View style={styles.searchBar}>
            <View style={styles.leftSearch}>
              <Ionicons name="search-outline" size={24} color="black" />
              <TextInput
                placeholder="Search store"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
              {searchQuery.trim() !== "" && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons
                    name="close-circle"
                    size={22}
                    color="gray"
                    style={{ marginLeft: 5 }}
                  />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              onPress={() => Alert.alert("Filter", "Filters coming soon!")}
            >
              <Ionicons name="options-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={{
          flex: 1,
          justifyContent: "space-between",
          marginBottom: 20,
          paddingHorizontal: 20,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 20 }}>
            <View style={{ height: 100 }} />
            {/* 🔁 Banners */}
            <FlatList
              ref={bannerRef}
              data={banners}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                setActiveIndex(index);
              }}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item.uri }}
                  style={{ width, height: height * 0.2 }}
                  resizeMode="cover"
                />
              )}
            />
            <View style={styles.dots}>
              {banners.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    { backgroundColor: i === activeIndex ? "#6CC51D" : "#ccc" },
                  ]}
                />
              ))}
            </View>

            {/* 🏷️ Categories */}
            <View style={styles.cat}>
              <Text style={styles.sectionTitle}>Categories</Text>
            </View>

            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const Icon = iconLibraries[item.icon_lib] || Ionicons;
                const isSelected = selectedCategory === item.label;
                return (
                  <TouchableOpacity
                    onPress={() =>
                      setSelectedCategory((prev) =>
                        prev === item.label ? null : item.label
                      )
                    }
                  >
                    <View
                      style={{ alignItems: "center", marginRight: 20, gap: 4 }}
                    >
                      <View
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 999,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: item.bg_color || "#eee",
                          borderWidth: isSelected ? 2 : 0,
                          borderColor: isSelected ? "#000" : "transparent",
                        }}
                      >
                        <Icon name={item.icon} size={30} color="black" />
                      </View>
                      <Text style={styles.categoryLabel}>{item.label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={{ paddingVertical: 10 }}
            />

            {selectedCategory && (
              <TouchableOpacity
                onPress={() => setSelectedCategory(null)}
                style={{ marginBottom: 10 }}
              >
                <Text style={{ color: "blue", fontSize: 16 }}>
                  Clear Category Filter
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.cat}>
              <Text style={styles.sectionTitle}>Featured Products</Text>
            </View>
          </View>
        }
        renderItem={({ item }) =>
          !isLoading && (
            <FeaturedCard
              width={cardWidth}
              key={item.id}
              item={item}
              wishlist={wishlist}
              createWishList={createWishList}
              isLoading={isLoading}
              onAddToCartToast={showToast}
            />
          )
        }
        ListEmptyComponent={
          isLoading && (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="large" />
            </View>
          )
        }
        contentContainerStyle={{
          paddingBottom: 100,
          ...(debouncedSearch.trim() !== "" && { marginTop: 100 }),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fixedSearch: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: "#dadada",
    paddingHorizontal: 20,
    paddingBottom: 1,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 10,
  },
  searchIcon: {
    backgroundColor: "#dadada",
    borderRadius: 20,
  },
  searchBar: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSearch: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  cat: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "600",
    marginVertical: 10,
  },
  categoryLabel: {
    fontSize: 15,
    color: "rgba(0, 0, 0, 0.7)",
    fontWeight: "700",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginHorizontal: 4,
  },
});
