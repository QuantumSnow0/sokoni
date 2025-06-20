import { View, Text, StyleSheet } from "react-native";
import { usePushNotifications } from "../../hooks/usePushNotifications";
import { useEffect } from "react";
export default function CartScreen() {
  const pushToken = usePushNotifications();
  console.log(pushToken);

  return <View></View>;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
