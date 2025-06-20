import { StyleSheet } from "react-native";
import SafeScreen from "../../components/SafeScreen";
import { Slot, Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </Stack>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
