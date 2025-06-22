import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform, StatusBar } from "react-native";

const SafeScreen = ({ children }) => {
  const insets = useSafeAreaInsets();
  const STATUS_BAR_HEIGHT =
    Platform.OS === "android" ? StatusBar.currentHeight : insets.top;

  return (
    <View style={{ flex: 1 }}>
      {/* Simulated StatusBar background */}
      <View
        style={{
          height: STATUS_BAR_HEIGHT,
          backgroundColor: "#fff", // ← Your custom background color
        }}
      />
      {/* Actual screen content with safe insets */}
      <View
        style={{
          paddingBottom: insets.bottom,
          flex: 1,
        }}
      >
        {children}
      </View>
    </View>
  );
};

export default SafeScreen;
