import { StyleSheet } from "react-native";
import SafeScreen from "../../components/SafeScreen";
import { Slot, Stack } from "expo-router";

const RootLayout = () => {
  return (
    <SafeScreen>
      {/* Move Stack inside SafeScreen */}
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="address" options={{ headerShown: false }} />
      </Stack>
    </SafeScreen>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
