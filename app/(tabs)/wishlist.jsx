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

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useWishList } from "../../hooks/useWishlist";
import { useEffect } from "react";
import CustomLoader from "../../components/CustomLoader";
const SCREEN_WIDTH = Dimensions.get("window").width;
const ACTION_WIDTH = SCREEN_WIDTH / 4;

export default function SwipeableItem() {
  const { wishlist, isLoading, fetchWishlist, createWishList } = useWishList();

  const router = useRouter();
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);
  const renderRightActions = (id) => (
    <TouchableOpacity
      style={[styles.rightAction, { width: ACTION_WIDTH }]}
      onPress={() => {
        createWishList(id);
      }}
    >
      <Ionicons name="trash" size={50} color="white" />
    </TouchableOpacity>
  );
  return (
    <>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 20,
          marginBottom: 20,
          backgroundColor: "white",
        }}
      >
        <TouchableWithoutFeedback onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={35}
            color="black"
            style={{ padding: 5 }}
          />
        </TouchableWithoutFeedback>
        <Text style={{ fontSize: 25, padding: 10, fontWeight: 700 }}>
          Favorites
        </Text>
        <View style={{ padding: 10 }}></View>
      </View>
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View style={{ marginTop: 10 }}>
            <CustomLoader />
          </View>
        ) : (
          <FlatList
            data={wishlist}
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingBottom: 40,
            }}
            renderItem={({ item, index }) => (
              <View style={styles.wrapper} key={index}>
                <Swipeable
                  renderRightActions={() => renderRightActions(item.id)}
                >
                  <View style={styles.item}>
                    {/* left wing */}
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={{
                          width: SCREEN_WIDTH / 6,
                          height: SCREEN_WIDTH / 4,
                          borderRadius: 10,
                        }}
                      />
                      <View>
                        <Text
                          style={{
                            color: "#6CC51D",
                            fontSize: 15,
                            fontWeight: "700",
                          }}
                        >
                          ksh {item.price}
                        </Text>
                        <Text style={{ fontSize: 15, fontWeight: "900" }}>
                          {item.title}
                        </Text>
                        <Text style={{ fontSize: 17, color: "#868889" }}>
                          {item.size}
                        </Text>
                      </View>
                    </View>
                    {/* right wing */}
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        paddingHorizontal: 10,
                      }}
                    >
                      <TouchableOpacity>
                        <Text style={styles.adjust}>+</Text>
                      </TouchableOpacity>
                      <Text style={{ fontSize: 20 }}>4</Text>
                      <TouchableOpacity>
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
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
    overflow: "hidden",
  },
  wrapper: {
    paddingHorizontal: 20,
  },
  rightAction: {
    backgroundColor: "red",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: "center",
    alignItems: "center",

    overflow: "hidden",
  },
  adjust: {
    fontSize: 40,
    color: "#6CC51D",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
