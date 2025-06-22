import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AddressItem from "../../components/AddressItem";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Address = () => {
  const router = useRouter();

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      enableOnAndroid
      extraScrollHeight={100}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View style={styles.topView}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "700" }}>My Address</Text>
        <Ionicons name="add-circle-outline" size={30} color="black" />
      </View>

      <FlatList
        data={[1, 2, 3]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <AddressItem />}
        scrollEnabled={false} // since parent handles scroll
      />
    </KeyboardAwareScrollView>
  );
};

export default Address;

const styles = StyleSheet.create({
  topView: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
});
