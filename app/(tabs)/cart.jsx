import { View, Text, StyleSheet } from "react-native";
import { usePushNotifications } from "../../hooks/usePushNotifications";
import CustomLoader from "../../components/CustomLoader";
import RotatingDotsLoader from "../../components/RotatingDotsLoader";
import TypingDotsLoader from "../../components/TypingDotsLoader";

export default function CartScreen() {
  const pushToken = usePushNotifications();

  return <View></View>;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  lottie: {
    width: 100,
    height: 100,
  },
});
