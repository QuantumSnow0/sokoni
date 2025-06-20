import { Slot } from "expo-router";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import Constants from "expo-constants";

const clerkPublishableKey =
  Constants.expoConfig.extra.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
console.log(clerkPublishableKey);
const RootLayout = () => {
  return (
    <SafeScreen>
      <StatusBar backgroundColor="red" style="dark" />
      <ClerkProvider
        publishableKey={
          "pk_test_c2VsZWN0ZWQtZ2xvd3dvcm0tMS5jbGVyay5hY2NvdW50cy5kZXYk"
        }
        tokenCache={tokenCache}
      >
        <Slot />
      </ClerkProvider>
    </SafeScreen>
  );
};

export default RootLayout;
