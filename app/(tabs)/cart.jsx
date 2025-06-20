import { View, Text, StyleSheet } from "react-native";
import { usePushNotifications } from "../../hooks/usePushNotifications";
import CustomLoader from "../../components/CustomLoader";
import RotatingDotsLoader from "../../components/RotatingDotsLoader";
import TypingDotsLoader from "../../components/TypingDotsLoader";

export default function CartScreen() {
  const pushToken = usePushNotifications();

  return (
    <View>
      <CustomLoader dotColor="#007AFF" dotSize={14} dotSpacing={10} />
      <RotatingDotsLoader size={80} color="#FF6B00" />
      <TypingDotsLoader
        label="getting favourites"
        dotColor="#007AFF"
        textColor="#222"
        speed={400}
      />
    </View>
  );
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
