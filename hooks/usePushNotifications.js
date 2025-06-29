import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    const registerForPushNotifications = async () => {
      try {
        if (!Device.isDevice) {
          Alert.alert(
            "Error",
            "Use a physical device to test push notifications."
          );
          return;
        }

        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          Alert.alert(
            "Error",
            "Failed to get push token for push notifications!"
          );
          return;
        }

        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
          });
        }

        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: "31cf5fc3-c686-42cf-a93c-3926b6baf582", // Replace with your Expo project ID
        });
        setExpoPushToken(tokenData.data);
        console.log("Push Token:", tokenData.data);
      } catch (error) {
        console.error("Error registering for push notifications:", error);
        Alert.alert("Error", `Failed to register: ${error.message}`);
      }
    };

    registerForPushNotifications();
  }, []);

  return expoPushToken;
}
