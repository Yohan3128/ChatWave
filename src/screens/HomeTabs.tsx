import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatsScreen from "./ChatsScreen";
import StatusScreen from "./StatusScreen";
import SettingScreen from "./SettingScreen";
import ProfileScreen from "./ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";
import { Platform } from "react-native";

const Tabs = createBottomTabNavigator();

export default function HomeTabs() {
  const { applied } = useTheme();
  const isDark = applied === "dark";

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let iconName = "chatbubble-ellipses";
          if (route.name === "Chats") iconName = "chatbubble-ellipses";
          else if (route.name === "Status") iconName = "time";
          else if (route.name === "Profile") iconName = "person-circle";
          else if (route.name === "Settings") iconName = "settings";
          return (
            <Ionicons
              name={iconName as any}
              size={focused ? 26 : 24}
              color={color}
            />
          );
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "700",
          marginBottom: Platform.OS === "ios" ? 0 : 8,
        },
        tabBarActiveTintColor: "#22d3ee",
        tabBarInactiveTintColor: isDark ? "#64748b" : "#94a3b8",
        tabBarStyle: {
          height: Platform.OS === "ios" ? 70 : 80,
          backgroundColor: isDark ? "#0a0e27" : "#ffffff",
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 24 : 8,
          borderTopWidth: 1,
          borderTopColor: isDark ? "#1e293b" : "#e2e8f0",
          shadowColor: "#06b6d4",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.2 : 0.1,
          shadowRadius: 4,
          elevation: 8,
        },
        headerStyle: {
          backgroundColor: isDark ? "#0a0e27" : "#ffffff",
          shadowColor: isDark ? "#06b6d4" : "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: "bold",
          color: isDark ? "#ffffff" : "#0f172a",
        },
        headerTintColor: isDark ? "#22d3ee" : "#0ea5e9",
      })}
    >
      <Tabs.Screen
        name="Chats"
        component={ChatsScreen}
        options={{ headerShown: false }}
      />
      <Tabs.Screen
        name="Status"
        component={StatusScreen}
        options={{ headerShown: false }}
      />

      <Tabs.Screen name="Profile" component={ProfileScreen} />
      <Tabs.Screen name="Settings" component={SettingScreen}/>
    </Tabs.Navigator>
  );
}
