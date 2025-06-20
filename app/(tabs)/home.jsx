import { SignedIn, SignedOut, useUser, useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
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
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { categories } from "../../utils/category";
import FeaturedCard from "../components/FeaturedCard";
import { useProducts } from "../../hooks/useProducts";
import { useWishList } from "../../hooks/useWishlist";
const { width, height } = Dimensions.get("window");
const cardSpacing = 20;
const cardWidth = (width - cardSpacing * 3) / 2;

export default function HomeScreen() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [token, setToken] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { wishlist, createWishList, fetchWishlist } = useWishList();
  const fetchToken = async () => {
    try {
      const reqToken = await getToken({ template: "api_access" });
      setToken(reqToken);
    } catch (error) {
      console.error("Failed to fetch token:", error);
    }
  };
  useEffect(() => {
    const storeUserId = async () => {
      const getUserId = await AsyncStorage.getItem("userId");
      if (!getUserId && user?.id) {
        await AsyncStorage.setItem("userId", user.id);
      }
    };
    storeUserId(); // ✅ CALL THE FUNCTION
  }, [user]);

  useEffect(() => {
    fetchToken();
  }, [token]);
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const { products, isLoading, fetchProducts } = useProducts(token);

  useEffect(() => {
    const setToken = async () => {
      await AsyncStorage.setItem("token", token);
    };
    if (token) {
      fetchProducts();
      setToken();
    }
  }, [token]);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 🔍 Fixed Search Bar */}
      <View style={styles.fixedSearch}>
        <View style={styles.searchIcon}>
          <View style={styles.searchBar}>
            <View style={styles.leftSearch}>
              <Ionicons name="search-outline" size={24} color="black" />
              <TextInput
                placeholder="search store"
                style={{
                  width: "85%",
                  fontSize: 20,
                }}
              />
            </View>
            <TouchableWithoutFeedback>
              <Ionicons name="options-outline" size={24} color="black" />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>

      {/* 🛒 Entire Content Inside FlatList */}
      <FlatList
        data={isLoading ? [] : products}
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
          <View style={{ paddingTop: 100, paddingHorizontal: 20 }}>
            {/* 🖼️ Banner */}
            <View>
              <Image
                source={require("../../assets/images/offer3.webp")}
                style={{
                  width: "100%",
                  height: height * 0.2,
                  marginTop: 10,
                }}
                resizeMode="stretch"
              />
              <View style={{ position: "absolute", left: 15, top: 30 }}>
                <Text style={styles.purchText}>20% off on Your</Text>
                <Text style={styles.purchText}>first purchase</Text>
              </View>
            </View>

            {/* 🧭 Categories */}
            <TouchableOpacity>
              <View style={styles.cat}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <Ionicons name="arrow-redo" size={28} color="black" />
              </View>
            </TouchableOpacity>
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => console.log(index)}>
                  <View
                    style={{
                      alignItems: "center",
                      marginRight: 20,
                      gap: 4,
                    }}
                  >
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 999,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: item.bgColor,
                      }}
                    >
                      <Image
                        source={item.icon}
                        style={{ width: 30, height: 30 }}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.categoryLabel}>{item.label}</Text>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingVertical: 10 }}
            />

            {/* 🛍️ Featured Products Header */}
            <TouchableOpacity>
              <View style={styles.cat}>
                <Text style={styles.sectionTitle}>Featured Products</Text>
                <Ionicons name="arrow-redo" size={28} color="black" />
              </View>
            </TouchableOpacity>
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
        contentContainerStyle={{ paddingBottom: 100 }}
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
  },
  cat: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  purchText: {
    fontSize: 27,
    fontWeight: "800",
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
});
