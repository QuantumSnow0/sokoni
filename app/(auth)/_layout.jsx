import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthRoutesLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  // Wait until Clerk finishes loading
  if (!isLoaded) {
    return null; // or a loading spinner
  }

  return (
    <>
      {/* Mount Stack FIRST */}
      <Stack screenOptions={{ headerShown: false }} />
      {/* Then redirect AFTER mounting */}
      {isSignedIn && <Redirect href="/" />}
    </>
  );
}
