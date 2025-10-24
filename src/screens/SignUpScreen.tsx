import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { useTheme } from "../theme/ThemeProvider";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useUserRegistration } from "../components/UserContext";
import { validateFirstName, validateLastName } from "../util/Validation";
import { Ionicons } from "@expo/vector-icons";

type SignUpProps = NativeStackNavigationProp<RootStack, "SignUpScreen">;

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpProps>();
  const { applied } = useTheme();
  const isDark = applied === "dark";
  const logo = require("../../assets/ChatWaveLogo.png");

  const { userData, setUserData } = useUserRegistration();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 100}
      className={`flex-1 ${isDark ? "bg-[#0a0e27]" : "bg-slate-50"}`}
    >
      <SafeAreaView className="flex-1 justify-center items-center px-6">
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={isDark ? "#0a0e27" : "#f8fafc"}
        />

        {/* Logo */}
        <View className="items-center">
          <Image source={logo} style={{ width: 190, height: 190 }} />
        </View>

        {/* Title Section */}
        <View className="w-full mb-8">
          <Text
            className={`text-base leading-6 text-center ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Create your ChatWave account now and dive into the conversation!
          </Text>
        </View>

        {/* Input Fields */}
        <View className="w-full">
          {/* First Name */}
          <View
            className={`mb-5 px-4 rounded-xl ${
              isDark ? "bg-slate-800/80" : "bg-white"
            }`}
            style={{
              shadowColor: isDark ? "#06b6d4" : "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isDark ? 0.2 : 0.05,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="person-outline"
                size={45}
                color={isDark ? "#22d3ee" : "#0ea5e9"}
                style={{ marginRight: 8 }}
              />
              <View className="flex-1">
                <FloatingLabelInput
                  label={"First Name"}
                  value={userData.firstName}
                  onChangeText={(text) => {
                    setUserData((previous) => ({
                      ...previous,
                      firstName: text,
                    }));
                  }}
                  labelStyles={{
                    color: isDark ? "#64748b" : "#94a3b8",
                    fontSize: 14,
                  }}
                  inputStyles={{
                    color: isDark ? "#ffffff" : "#0f172a",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                  containerStyles={{
                    borderWidth: 0,
                    paddingHorizontal: 0,
                  }}
                />
              </View>
            </View>
          </View>

          {/* Last Name */}
          <View
            className={`mb-6 px-4 rounded-xl ${
              isDark ? "bg-slate-800/80" : "bg-white"
            }`}
            style={{
              shadowColor: isDark ? "#06b6d4" : "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isDark ? 0.2 : 0.05,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="person-outline"
                size={45}
                color={isDark ? "#22d3ee" : "#0ea5e9"}
                style={{ marginRight: 8 }}
              />
              <View className="flex-1">
                <FloatingLabelInput
                  label={"Last Name"}
                  value={userData.lastName}
                  onChangeText={(text) => {
                    setUserData((previous) => ({
                      ...previous,
                      lastName: text,
                    }));
                  }}
                  labelStyles={{
                    color: isDark ? "#64748b" : "#94a3b8",
                    fontSize: 14,
                  }}
                  inputStyles={{
                    color: isDark ? "#ffffff" : "#0f172a",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                  containerStyles={{
                    borderWidth: 0,
                    paddingHorizontal: 0,
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Next Button */}
        <View className="w-full mt-2">
          <Pressable
            className="h-14 justify-center items-center rounded-2xl flex-row"
            style={{
              backgroundColor: "#22d3ee",
              shadowColor: "#06b6d4",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 8,
              elevation: 8,
            }}
            onPress={() => {
              let validFirstName = validateFirstName(userData.firstName);
              let validLastName = validateLastName(userData.lastName);
              if (validFirstName) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: validFirstName,
                });
              } else if (validLastName) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: validLastName,
                });
              } else {
                navigation.navigate("ContactScreen");
              }
            }}
          >
            <Text className="text-white font-bold text-lg mr-2">Next</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </Pressable>
        </View>

        {/* Sign In Link */}
        <View className="flex-row justify-center mt-6">
          <Text
            className={`text-sm ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Already have an account?{" "}
          </Text>
          <Pressable onPress={() => navigation.navigate("SignInScreen")}>
            <Text className="text-sm font-semibold text-cyan-400">Sign In</Text>
          </Pressable>
        </View>

        {/* Decorative Elements */}
        <View className="absolute top-0 right-0 w-40 h-40 rounded-full bg-cyan-500/10 -mr-20 -mt-20" />
        <View className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-blue-500/10 -ml-16 -mb-16" />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
