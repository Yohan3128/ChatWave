import { AntDesign } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";

import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";

import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useUserRegistration } from "../components/UserContext";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { validateCountryCode, validatePhoneNo } from "../util/Validation";
import { useTheme } from "../theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

type ContactProps = NativeStackNavigationProp<RootStack, "ContactScreen">;

export default function ContactScreen() {
  const navigation = useNavigation<ContactProps>();
  const { applied } = useTheme();
  const isDark = applied === "dark";

  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [show, setShow] = useState<boolean>(false);

  const { userData, setUserData } = useUserRegistration();
  const [callingCode, setCallingCode] = useState("+94");
  const [phoneNo, setPhoneNo] = useState("");

  return (
    <SafeAreaView
      className={`flex-1 items-center ${
        isDark ? "bg-[#0a0e27]" : "bg-slate-50"
      }`}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#0a0e27" : "#f8fafc"}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 100}
      >
        <View className="p-5 items-center flex-1 mt-24">
          <View className="items-center">
            <Image
              source={require("../../assets/ChatWaveLogo.png")}
              style={{ width: 190, height: 190 }}
            />
          </View>
          <View className="mt-6">
            <Text
              className={`font-semibold text-center leading-6 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              We use your contacts to help you find friends who are already on
              the app. Your contacts stay private.
            </Text>
          </View>

          <View className="mt-5 w-full">
            <View
              className={`justify-center items-center flex-row h-14 mb-5 px-4 rounded-xl ${
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
              <Ionicons
                name="globe-outline"
                size={20}
                color={isDark ? "#22d3ee" : "#0ea5e9"}
                style={{ marginRight: 8 }}
              />
              <CountryPicker
                countryCode={countryCode}
                withFilter
                withFlag
                withCountryNameButton
                withCallingCode
                visible={show}
                onClose={() => {
                  setShow(false);
                }}
                onSelect={(c) => {
                  setCountryCode(c.cca2);
                  setCountry(c);
                  setShow(false);
                }}
                theme={
                  isDark
                    ? {
                        backgroundColor: "#1e293b",
                        onBackgroundTextColor: "#e2e8f0",
                        primaryColor: "#22d3ee",
                      }
                    : { primaryColor: "#22d3ee" }
                }
              />

              <AntDesign
                name="caret-down"
                size={18}
                color={isDark ? "#22d3ee" : "#0ea5e9"}
                style={{ marginTop: 5, marginLeft: 8 }}
              />
            </View>

            <View className="mt-2 flex flex-row justify-center">
              <TextInput
                inputMode="tel"
                className={`h-16 font-bold text-lg w-[22%] rounded-xl px-3 ${
                  isDark
                    ? "bg-slate-800/80 text-cyan-400"
                    : "bg-white text-cyan-600"
                }`}
                style={{
                  shadowColor: isDark ? "#06b6d4" : "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: isDark ? 0.2 : 0.05,
                  shadowRadius: 2,
                  elevation: 2,
                }}
                placeholder="+94"
                placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                editable={false}
                value={country ? `+${country.callingCode}` : callingCode}
                onChangeText={(text) => {
                  setCallingCode(text);
                }}
              />
              <TextInput
                inputMode="tel"
                className={`h-16 font-bold text-lg w-[80%] ml-2 rounded-xl px-4 ${
                  isDark
                    ? "bg-slate-800/80 text-white"
                    : "bg-white text-slate-900"
                }`}
                style={{
                  shadowColor: isDark ? "#06b6d4" : "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: isDark ? 0.2 : 0.05,
                  shadowRadius: 2,
                  elevation: 2,
                }}
                placeholder="77 #### ###"
                placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                value={phoneNo}
                onChangeText={(text) => {
                  setPhoneNo(text);
                }}
              />
            </View>
          </View>

          {/* Info Box */}
          {phoneNo && (
            <View
              className={`w-full p-4 mt-6 rounded-xl ${
                isDark ? "bg-slate-800/50" : "bg-cyan-50"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  isDark ? "text-slate-400" : "text-cyan-700"
                }`}
              >
                Full Number:
              </Text>
              <Text
                className={`text-base font-bold mt-1 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {country ? `+${country.callingCode}` : callingCode} {phoneNo}
              </Text>
            </View>
          )}

          <View className="mt-12 w-full">
            <Pressable
              className="justify-center items-center w-full h-14 rounded-2xl flex-row"
              style={{
                backgroundColor: "#22d3ee",
                shadowColor: "#06b6d4",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 8,
                elevation: 8,
              }}
              onPress={() => {
                const validCountryCode = validateCountryCode(callingCode);
                const validPhoneNo = validatePhoneNo(phoneNo);

                if (validCountryCode) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: validCountryCode,
                  });
                } else if (validPhoneNo) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: validPhoneNo,
                  });
                } else {
                  setUserData((previous) => ({
                    ...previous,
                    countryCode: country
                      ? `+${country.callingCode}`
                      : callingCode,
                    contactNo: phoneNo,
                  }));
                  navigation.replace("AvatarScreen");
                }
              }}
            >
              <Text className="text-xl font-bold text-white mr-2">Next</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
