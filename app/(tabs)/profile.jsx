import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import SignOutButton from "../components/SignOutButton";
import { FlatList } from "react-native-gesture-handler";
import { profileView } from "../../utils/profileDetails";
import { Ionicons } from "@expo/vector-icons";
import { useUsers } from "../../hooks/useUser";
import { useEffect } from "react";
import { useRouter } from "expo-router";
const { width, height } = Dimensions.get("window");
const ProfileScreen = () => {
  const { currentUser, getCurrentUser } = useUsers();
  const router = useRouter();
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);
  const firstName = currentUser?.name?.split(" ")[0];
  const initName = firstName?.split("")[0];

  return (
    <>
      <FlatList
        data={profileView}
        ListHeaderComponent={() => (
          <View style={{ marginBottom: 30 }}>
            <View style={styles.topView} />
            <View style={styles.bioContainer}>
              <View style={styles.initContainer}>
                <Text style={styles.initText} numberOfLines={1}>
                  {initName}
                </Text>
              </View>
              <Text style={styles.fname}>{currentUser?.name}</Text>
              <Text style={styles.mail}>{currentUser?.email}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.renderContainer}
            onPress={() => router.push(`(root)/${item.link}`)}
          >
            <View style={styles.leftRender}>
              <Ionicons name={item.icon} size={30} color="#28B446" />
              <Text style={{ fontSize: 20, fontWeight: "600" }}>
                {item.title}
              </Text>
            </View>

            <Ionicons name="arrow-forward" size={30} color="black" />
          </TouchableOpacity>
        )}
        ListFooterComponent={() => <SignOutButton />}
      />
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  topView: {
    display: "flex",
    height: height / 5.5,
    backgroundColor: "white",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  bioContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  renderContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: "center",
  },
  leftRender: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  initContainer: {
    backgroundColor: "#28B446",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: width / 3,
    height: width / 3,
    borderRadius: 999,
    marginTop: -70,
  },
  initText: {
    fontSize: 90,
    fontWeight: "900",
    padding: 10,
    color: "white",
    textTransform: "capitalize",
    overflow: "visible",
  },
  fname: {
    fontSize: 20,
    fontWeight: "800",
    textTransform: "capitalize",
    width: "100%",
    textAlign: "center",
  },
  mail: {
    fontSize: 20,
  },
});
