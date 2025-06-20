import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const TabIcon = ({ focused, name }) => {
  if (focused)
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          width: 80,
          height: 80,
          flexDirection: "row",
          marginTop: 10,
          position: "absolute",
          backgroundColor: "green",
          padding: 20,
          borderRadius: 9999,
          bottom: -20,
        }}
      >
        <Ionicons name={name} size={30} color="white" />
      </View>
    );

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 80,
        flexDirection: "row",
        marginTop: 10,
        position: "absolute",
        bottom: -35,
        padding: 20,
        borderRadius: 9999,
      }}
    >
      <Ionicons name={name} size={30} color="black" />
    </View>
  );
};

// 👇 Reusable custom button with ripple disabled
const NoRippleButton = (props) => (
  <Pressable
    {...props}
    android_ripple={null}
    style={({ pressed }) => [
      {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      },
      pressed && { opacity: 1 },
    ]}
  />
);

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 65,
            elevation: 0,
            backgroundColor: "transparent",
            shadowColor: "transparent",
            borderTopWidth: 1,
            borderTopColor: "white",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarButton: (props) => <NoRippleButton {...props} />,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} name={"home-outline"} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarButton: (props) => <NoRippleButton {...props} />,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} name={"person-outline"} />
            ),
          }}
        />
        <Tabs.Screen
          name="wishlist"
          options={{
            tabBarButton: (props) => <NoRippleButton {...props} />,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} name={"heart-outline"} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            tabBarButton: (props) => <NoRippleButton {...props} />,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} name={"cart-outline"} />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
