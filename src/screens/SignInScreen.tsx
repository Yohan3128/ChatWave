import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeProvider";
import { useState, useRef, useContext } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { RootStack } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { NumberVerification } from "../api/UserService";
import { AuthContext } from "../components/AuthProvider";

type SignInProps = NativeStackNavigationProp<RootStack, "SignInScreen">;

export default function SignInScreen() {
  const { applied } = useTheme();
  const isDark = applied === "dark";
  const auth = useContext(AuthContext);
  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [callingCode, setCallingCode] = useState("94");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [verificationCodeBackend, setVerificationCodeBackend] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const navigation = useNavigation<SignInProps>();

  const otpRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const onSelectCountry = (selectedCountry: Country) => {
    setCountryCode(selectedCountry.cca2);
    setCountry(selectedCountry);
    setCallingCode(selectedCountry.callingCode[0]);
    setPhoneNumber("");
  };

  const sendVerificationCode = async () => {
    if (!phoneNumber.trim()) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Invalid Number",
        textBody: "Please enter your phone number",
        autoClose: 2000,
      });
      return;
    }
    setIsLoading(true);
    const response = await NumberVerification(callingCode, phoneNumber);

    if (response.status) {
      setVerificationCodeBackend(response.vCode);
      setShowVerificationModal(true);
      setIsLoading(false);
      setUserId(response.userId);
      console.log(verificationCodeBackend, userId);

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Code Sent",
        textBody: `Verification code sent to +${callingCode}${phoneNumber}`,
        autoClose: 3000,
      });
    }else{
      setIsLoading(false);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Failed to send verification code. Please try again."+response.message,
        autoClose: 3000,
      });
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !verificationCode[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const verifyCode = async () => {
    const enteredCode = verificationCode.join("");

    if (enteredCode.length !== 6) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Invalid Code",
        textBody: "Please enter the 6-digit verification code",
        autoClose: 2000,
      });
      return;
    }

    setIsVerifying(true);
    if (enteredCode === verificationCodeBackend) {
      setIsVerifying(false);
      setShowVerificationModal(false);
      try {
        const response = {
          status: true,
          userId: userId,
          message: "Sign in successful",
        };

        if (response.status) {
          const userId = response.userId;

          if (auth) {
            await auth.signUp(String(userId));
          }
        } else {
          Toast.show({
            type: ALERT_TYPE.WARNING,
            title: "WARNING",
            textBody: response.message,
            autoClose: 2000,
            textBodyStyle: { fontSize: 15 },
          });
        }
      } catch (error) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Failed to sign in. Please try again.",
          autoClose: 3000,
          textBodyStyle: { fontSize: 15 },
        });
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const resendCode = () => {
    sendVerificationCode;
    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: "Code Sent",
      textBody: "New verification code has been sent",
      autoClose: 2000,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#0a0e27" : "#f8fafc" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <SafeAreaView className="flex-1 px-6">
          <StatusBar
            barStyle={isDark ? "light-content" : "dark-content"}
            backgroundColor={isDark ? "#0a0e27" : "#f8fafc"}
          />

          {/* Logo */}
          <View className="items-center mt-12">
            <Image
              source={require("../../assets/ChatWaveLogo.png")}
              style={{ width: 250, height: 150 }}
            />
          </View>

          <View className="items-center mb-6">
            <Text
              className={`text-base text-center ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Connect • Chat • Collaborate
            </Text>
          </View>

          {/* Phone Number Section */}
          <View className="mt-4">
            <Text
              className={`mb-3 text-sm font-semibold ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Phone Number
            </Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => setShowCountryPicker(true)}
                className={`flex-row items-center px-4 py-4 mr-2 rounded-xl ${
                  isDark ? "bg-slate-800" : "bg-white"
                }`}
                style={{
                  shadowColor: isDark ? "#06b6d4" : "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: isDark ? 0.2 : 0.05,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <CountryPicker
                  countryCode={countryCode}
                  withFilter
                  withFlag
                  withCallingCode
                  withEmoji
                  onSelect={onSelectCountry}
                  visible={showCountryPicker}
                  onClose={() => setShowCountryPicker(false)}
                  theme={
                    isDark
                      ? {
                          backgroundColor: "#1e293b",
                          onBackgroundTextColor: "#e2e8f0",
                          fontSize: 16,
                          filterPlaceholderTextColor: "#94a3b8",
                          primaryColor: "#22d3ee",
                        }
                      : {
                          primaryColor: "#22d3ee",
                        }
                  }
                />
                <Text
                  className={`ml-2 text-base font-bold ${
                    isDark ? "text-cyan-400" : "text-cyan-600"
                  }`}
                >
                  +{callingCode}
                </Text>
                <MaterialIcons
                  name="arrow-drop-down"
                  size={24}
                  color={isDark ? "#22d3ee" : "#0ea5e9"}
                />
              </TouchableOpacity>

              <View className="flex-1">
                <TextInput
                  value={phoneNumber}
                  onChangeText={(text) => setPhoneNumber(text)}
                  placeholder="712345678"
                  placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                  keyboardType="phone-pad"
                  maxLength={15}
                  className={`px-4 py-4 text-base font-semibold rounded-xl ${
                    isDark
                      ? "bg-slate-800 text-white"
                      : "bg-white text-slate-900"
                  }`}
                  style={{
                    shadowColor: isDark ? "#06b6d4" : "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: isDark ? 0.2 : 0.05,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                />
              </View>
            </View>

            {phoneNumber && (
              <View
                className={`p-4 mt-4 rounded-xl ${
                  isDark ? "bg-slate-800/80" : "bg-cyan-50"
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
                  +{callingCode} {phoneNumber}
                </Text>
              </View>
            )}
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            className="flex-row items-center justify-center w-full py-4 mt-10 rounded-2xl"
            style={{
              backgroundColor: "#22d3ee",
              shadowColor: "#06b6d4",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 8,
              elevation: 8,
            }}
            onPress={sendVerificationCode}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text className="text-lg font-bold text-center text-white">
                  Send Verification Code
                </Text>
                <MaterialIcons
                  className="ml-2"
                  name="keyboard-arrow-right"
                  size={24}
                  color="white"
                />
              </>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-6">
            <Text
              className={`text-sm ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUpScreen")}
            >
              <Text className="text-sm font-semibold text-cyan-400">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
      {/* Verification Modal */}
      <Modal
        visible={showVerificationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVerificationModal(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <View className="items-center justify-center flex-1 bg-black/60">
            <View
              className={`w-11/12 p-6 rounded-3xl ${
                isDark ? "bg-slate-800" : "bg-white"
              }`}
            >
              <TouchableOpacity
                onPress={() => setShowVerificationModal(false)}
                className="absolute z-10 top-4 right-4"
              >
                <Ionicons
                  name="close-circle"
                  size={32}
                  color={isDark ? "#64748b" : "#94a3b8"}
                />
              </TouchableOpacity>

              <View className="items-center mt-4">
                <View
                  className="items-center justify-center w-20 h-20 rounded-full"
                  style={{
                    backgroundColor: isDark ? "#1e293b" : "#ecfeff",
                  }}
                >
                  <Ionicons name="mail-open" size={40} color="#22d3ee" />
                </View>
                <Text
                  className={`mt-4 text-2xl font-bold text-center ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Enter Verification Code
                </Text>
                <Text
                  className={`mt-2 text-sm text-center ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Code sent to +{callingCode} {phoneNumber}
                </Text>
              </View>

              <View className="flex-row justify-between mt-8">
                {verificationCode.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={otpRefs[index]}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={({ nativeEvent: { key } }) =>
                      handleOtpKeyPress(key, index)
                    }
                    maxLength={1}
                    keyboardType="number-pad"
                    className={`items-center justify-center w-12 text-2xl font-bold text-center h-14 rounded-xl ${
                      isDark
                        ? "bg-slate-700 text-white"
                        : "bg-cyan-50 text-slate-900"
                    }`}
                    style={{
                      borderWidth: 2,
                      borderColor: digit
                        ? "#22d3ee"
                        : isDark
                        ? "#334155"
                        : "#cbd5e1",
                    }}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={verifyCode}
                disabled={isVerifying}
                className="w-full py-4 mt-8 rounded-2xl"
                style={{
                  backgroundColor: "#22d3ee",
                  shadowColor: "#06b6d4",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.5,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                {isVerifying ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-lg font-bold text-center text-white">
                    Verify & Sign In
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex-row items-center justify-center mt-4">
                <Text
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Didn't receive code?{" "}
                </Text>
                <TouchableOpacity onPress={resendCode}>
                  <Text className="text-sm font-semibold text-cyan-400">
                    Resend
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
