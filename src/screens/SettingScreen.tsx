import { Text, TouchableOpacity, View, StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeOption, useTheme } from "../theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { useContext, useLayoutEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../components/AuthProvider";

const options: ThemeOption[] = ["light", "dark", "system"];

const themeIcons = {
  light: "sunny",
  dark: "moon",
  system: "phone-portrait",
};

type SettingScreenProp = NativeStackNavigationProp<RootStack, "SettingScreen">;

export default function SettingScreen() {
  const { preference, applied, setPreference } = useTheme();
  const navigation = useNavigation<SettingScreenProp>();
  const auth = useContext(AuthContext);
  const isDark = applied === "dark";

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Settings",
      headerStyle: {
        backgroundColor: isDark ? "#0a0e27" : "#ffffff",
      
      },
      headerTintColor: isDark ? "#22d3ee" : "#0ea5e9",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 20,
      },
    });
  }, [navigation, isDark]);

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-[#0a0e27]" : "bg-slate-50"}`}
      edges={["right", "bottom", "left"]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#0a0e27" : "#ffffff"}
      />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-5">
          {/* App Theme Section */}
          <View
            className={`p-5 rounded-2xl mb-5 ${
              isDark ? "bg-slate-800/80" : "bg-white"
            }`}
            style={{
              shadowColor: isDark ? "#06b6d4" : "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.2 : 0.05,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            <View className="flex-row items-center mb-4">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{
                  backgroundColor: isDark ? "#22d3ee20" : "#22d3ee15",
                }}
              >
                <Ionicons
                  name="color-palette"
                  size={20}
                  color={isDark ? "#22d3ee" : "#0ea5e9"}
                />
              </View>
              <Text
                className={`font-bold text-lg ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                App Theme
              </Text>
            </View>

            <Text
              className={`mb-4 text-sm ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Choose how ChatWave looks on your device
            </Text>

            <View className="gap-y-3">
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  className={`flex-row items-center p-4 rounded-xl ${
                    preference === option
                      ? "bg-cyan-500"
                      : isDark
                      ? "bg-slate-700/50"
                      : "bg-slate-100"
                  }`}
                  style={
                    preference === option
                      ? {
                          shadowColor: "#06b6d4",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.4,
                          shadowRadius: 4,
                          elevation: 5,
                        }
                      : {}
                  }
                  onPress={() => setPreference(option)}
                >
                  <View
                    className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
                      preference === option
                        ? "bg-white/20"
                        : isDark
                        ? "bg-slate-600"
                        : "bg-white"
                    }`}
                  >
                    <Ionicons
                      name={themeIcons[option] as any}
                      size={24}
                      color={
                        preference === option
                          ? "#ffffff"
                          : isDark
                          ? "#22d3ee"
                          : "#0ea5e9"
                      }
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`font-bold text-base ${
                        preference === option
                          ? "text-white"
                          : isDark
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                    <Text
                      className={`text-sm mt-1 ${
                        preference === option
                          ? "text-cyan-50"
                          : isDark
                          ? "text-slate-400"
                          : "text-slate-600"
                      }`}
                    >
                      {option === "light"
                        ? "Always use light mode"
                        : option === "dark"
                        ? "Always use dark mode"
                        : "Follow system settings"}
                    </Text>
                  </View>
                  {preference === option && (
                    <Ionicons name="checkmark-circle" size={28} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View
            className={`p-4 rounded-xl flex-row items-center mb-5 ${
              isDark ? "bg-slate-800/50" : "bg-cyan-50"
            }`}
          >
            <Ionicons
              name="information-circle"
              size={20}
              color={isDark ? "#22d3ee" : "#0ea5e9"}
            />
            <Text
              className={`ml-3 text-sm flex-1 ${
                isDark ? "text-slate-400" : "text-slate-700"
              }`}
            >
              Currently using{" "}
              <Text className="font-bold">
                {applied === "dark" ? "Dark" : "Light"}
              </Text>{" "}
              theme
              {preference === "system" && " (from system settings)"}
            </Text>
          </View>

          <View className="mb-5">
            <Text
              className={`font-bold text-lg mb-3 px-1 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Account
            </Text>

            <View
              className={`p-5 rounded-2xl ${
                isDark ? "bg-slate-800/80" : "bg-white"
              }`}
              style={{
                shadowColor: isDark ? "#06b6d4" : "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.2 : 0.05,
                shadowRadius: 3,
                elevation: 3,
              }}
            >
              <TouchableOpacity 
                className="flex-row items-center py-3 border-b border-slate-700/30"
                onPress={() => navigation.navigate("ProfileScreen")}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{
                    backgroundColor: isDark ? "#22d3ee20" : "#22d3ee15",
                  }}
                >
                  <Ionicons
                    name="person"
                    size={20}
                    color={isDark ? "#22d3ee" : "#0ea5e9"}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Edit Profile
                  </Text>
                  <Text
                    className={`text-xs mt-1 ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Update your profile information
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isDark ? "#64748b" : "#94a3b8"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-6">
            <TouchableOpacity
              className="flex-row items-center justify-center p-4 rounded-2xl"
              style={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                borderWidth: 2,
                borderColor: "#ef4444",
                shadowColor: "#ef4444",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={() => {
                if (auth) auth.signOut();
              }}
            >
              <Ionicons name="log-out-outline" size={24} color="#ef4444" />
              <Text className="font-bold text-lg text-red-500 ml-3">
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
