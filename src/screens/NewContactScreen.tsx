import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { FloatingLabelInput } from "react-native-floating-label-input";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import {
  validateCountryCode,
  validateFirstName,
  validateLastName,
  validatePhoneNo,
} from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useSendNewContact } from "../socket/UseSendNewContact";
import { useTheme } from "../theme/ThemeProvider";

type NewContactScreenProp = NativeStackNavigationProp<
  RootStack,
  "NewContactScreen"
>;
export default function NewContactScreen() {
  const navigation = useNavigation<NewContactScreenProp>();
  const { applied } = useTheme();
  const isDark = applied === "dark";

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: {
        backgroundColor: isDark ? "#0a0e27" : "#ffffff",
      },
      headerLeft: () => (
        <View className="items-center flex-row gap-x-2">
          <TouchableOpacity
            className="justify-center items-center"
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons
              name="arrow-back-sharp"
              size={24}
              color={isDark ? "#22d3ee" : "#0ea5e9"}
            />
          </TouchableOpacity>
          <View className="flex-col">
            <Text
              className={`text-lg font-bold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              New Contact
            </Text>
          </View>
        </View>
      ),
    });
  }, [navigation, isDark]);

  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [callingCode, setCallingCode] = useState("+94");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const newContact = useSendNewContact();
  const sendNewContact = newContact.sendNewContact;
  const responseText = newContact.responseText;

  const sendData = () => {
    sendNewContact({
      id: 0,
      firstName: firstName,
      lastName: lastName,
      countryCode: callingCode,
      contactNo: phoneNo,
      createdAt: "",
      updatedAt: "",
      status: "",
    });
    setFirstName("");
    setLastName("");
    setCallingCode("+94");
    setPhoneNo("");
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-[#0a0e27]" : "bg-slate-50"}`}
    >
      <View className="flex-1 px-5 pt-6">
        {/* Header Icon */}
        <View className="items-center mb-8">
          <View
            className={`h-24 w-24 rounded-full justify-center items-center ${
              isDark ? "bg-slate-800" : "bg-cyan-50"
            }`}
            style={{
              shadowColor: "#06b6d4",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.3 : 0.2,
              shadowRadius: 6,
              elevation: 5,
            }}
          >
            <Ionicons
              name="person-add"
              size={40}
              color={isDark ? "#22d3ee" : "#0ea5e9"}
            />
          </View>
        </View>

        {/* First Name */}
        <View
          className={`flex-row items-center gap-x-3 h-14 px-4 rounded-xl ${
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
          <Feather
            name="user"
            size={22}
            color={isDark ? "#22d3ee" : "#0ea5e9"}
          />
          <View className="flex-1 h-14">
            <FloatingLabelInput
              label="First Name"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
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

        {/* Last Name */}
        <View
          className={`flex-row items-center gap-x-3 mt-5 h-14 px-4 rounded-xl ${
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
          <Feather
            name="user"
            size={22}
            color={isDark ? "#22d3ee" : "#0ea5e9"}
          />
          <View className="flex-1 h-14">
            <FloatingLabelInput
              label="Last Name"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
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

        {/* Country Picker */}
        <TouchableOpacity
          className={`flex-row items-center justify-between px-4 h-14 mt-5 rounded-xl ${
            isDark ? "bg-slate-800/80" : "bg-white"
          }`}
          style={{
            shadowColor: isDark ? "#06b6d4" : "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDark ? 0.2 : 0.05,
            shadowRadius: 2,
            elevation: 2,
          }}
          onPress={() => setShow(true)}
        >
          <View className="flex-row items-center gap-x-3">
            <Ionicons
              name="globe-outline"
              size={22}
              color={isDark ? "#22d3ee" : "#0ea5e9"}
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
                      onBackgroundTextColor: "#ffffff",
                      primaryColor: "#22d3ee",
                    }
                  : undefined
              }
            />
          </View>
          <AntDesign
            name="caret-down"
            size={18}
            color={isDark ? "#64748b" : "#94a3b8"}
          />
        </TouchableOpacity>

        {/* Phone Number */}
        <View
          className={`flex-row items-center gap-x-3 mt-5 h-14 px-4 rounded-xl ${
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
          <Feather
            name="phone"
            size={22}
            color={isDark ? "#22d3ee" : "#0ea5e9"}
          />
          <View className="h-14 items-center justify-center px-2 w-20">
            <Text
              className={`font-bold text-base ${
                isDark ? "text-cyan-400" : "text-cyan-600"
              }`}
            >
              {country ? `+${country.callingCode}` : callingCode}
            </Text>
          </View>
          <View
            className={`h-8 w-px ${
              isDark ? "bg-slate-700" : "bg-slate-200"
            }`}
          />
          <View className="flex-1 h-14">
            <FloatingLabelInput
              label="Phone Number"
              inputMode="tel"
              value={phoneNo}
              onChangeText={(text) => setPhoneNo(text)}
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

        {/* Save Button */}
        <View className="mt-10">
          <Pressable
            className="h-14 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: "#22d3ee",
              shadowColor: "#06b6d4",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 8,
              elevation: 8,
            }}
            onPress={() => {
              const firstNameValid = validateFirstName(firstName);
              const lastNameValid = validateLastName(lastName);
              const countryCodeValid = validateCountryCode(callingCode);
              const phoneNoValid = validatePhoneNo(phoneNo);

              if (firstNameValid) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: firstNameValid,
                });
              } else if (lastNameValid) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: lastNameValid,
                });
              } else if (countryCodeValid) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: countryCodeValid,
                });
              } else if (phoneNoValid) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: phoneNoValid,
                });
              } else {
                sendData();
              }
            }}
          >
            <Text className="font-bold text-lg text-white">Save Contact</Text>
          </Pressable>
        </View>

        {/* Info Text */}
        <View className="mt-6 px-4">
          <Text
            className={`text-center text-sm ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}