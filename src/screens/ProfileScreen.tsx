import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useContext, useLayoutEffect, useState } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useUserProfile } from "../socket/UseUserProfile";
import { uploadProfileImage } from "../api/UserService";
import { AuthContext } from "../components/AuthProvider";

type ProfileScreenProp = NativeStackNavigationProp<RootStack, "ProfileScreen">;
export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenProp>();
  const { applied } = useTheme();
  const userProfile = useUserProfile();
  const isDark = applied === "dark";

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "My Profile",
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

  const [image, setImage] = useState<string | null>(null);
  const auth = useContext(AuthContext);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadProfileImage(String(auth ? auth.userId : 0), result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-[#0a0e27]" : "bg-slate-50"}`}
    >
      <View className="flex-1 w-full">
        {/* Profile Header Section */}
        <View
          className={`items-center pt-8 pb-6 ${
            isDark ? "bg-slate-800/50" : "bg-white"
          }`}
          style={{
            shadowColor: isDark ? "#06b6d4" : "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowRadius: 6,
            elevation: 5,
          }}
        >
          {/* Profile Image with Gradient Border */}
          <View className="relative mb-4">
            <View
              className="w-44 h-44 rounded-full items-center justify-center"
              style={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                shadowColor: "#06b6d4",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <View
                className="w-40 h-40 rounded-full overflow-hidden"
                style={{
                  borderWidth: 4,
                  borderColor: "#22d3ee",
                }}
              >
                {image ? (
                  <Image
                    className="w-full h-full"
                    source={{ uri: image }}
                    resizeMode="cover"
                  />
                ) : userProfile?.profileImage ? (
                  <Image
                    className="w-full h-full"
                    source={{ uri: userProfile?.profileImage }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    className={`w-full h-full items-center justify-center ${
                      isDark ? "bg-slate-700" : "bg-cyan-50"
                    }`}
                  >
                    <Ionicons
                      name="person"
                      size={60}
                      color={isDark ? "#22d3ee" : "#0ea5e9"}
                    />
                  </View>
                )}
              </View>
            </View>
            {/* Camera Icon */}
            <TouchableOpacity
              className="absolute bottom-2 right-2 w-12 h-12 rounded-full items-center justify-center"
              style={{
                backgroundColor: "#22d3ee",
                shadowColor: "#06b6d4",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
                elevation: 6,
              }}
              onPress={pickImage}
            >
              <Ionicons name="camera" size={22} color="white" />
            </TouchableOpacity>
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity
            className="px-6 py-2 rounded-full"
            style={{
              backgroundColor: isDark ? "#1e293b" : "#ffffff",
              borderWidth: 2,
              borderColor: "#22d3ee",
            }}
            onPress={pickImage}
          >
            <Text className="font-bold text-cyan-400 text-base">
              Edit Profile Picture
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Information Section */}
        <View className="px-4 pt-6">
          {/* Name Card */}
          <View
            className={`mb-4 p-5 rounded-2xl ${
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
            <View className="flex-row items-center mb-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{
                  backgroundColor: isDark ? "#22d3ee20" : "#22d3ee15",
                }}
              >
                <Feather
                  name="user"
                  size={20}
                  color={isDark ? "#22d3ee" : "#0ea5e9"}
                />
              </View>
              <Text
                className={`font-semibold text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                NAME
              </Text>
            </View>
            <Text
              className={`font-bold text-xl ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {userProfile?.firstName} {userProfile?.lastName}
            </Text>
          </View>

          {/* Phone Card */}
          <View
            className={`mb-4 p-5 rounded-2xl ${
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
            <View className="flex-row items-center mb-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{
                  backgroundColor: isDark ? "#22d3ee20" : "#22d3ee15",
                }}
              >
                <Feather
                  name="phone"
                  size={20}
                  color={isDark ? "#22d3ee" : "#0ea5e9"}
                />
              </View>
              <Text
                className={`font-semibold text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                PHONE NUMBER
              </Text>
            </View>
            <Text
              className={`font-bold text-xl ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {userProfile?.countryCode} {userProfile?.contactNo}
            </Text>
          </View>

          {/* Status Card */}
          <View
            className={`mb-4 p-5 rounded-2xl ${
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
            <View className="flex-row items-center mb-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{
                  backgroundColor: isDark ? "#22d3ee20" : "#22d3ee15",
                }}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={22}
                  color={isDark ? "#22d3ee" : "#0ea5e9"}
                />
              </View>
              <Text
                className={`font-semibold text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                ABOUT
              </Text>
            </View>
            <Text
              className={`font-medium text-base ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Hey there! I am using ChatWave
            </Text>
          </View>

          {/* Account Info */}
          <View className="mt-4 px-4">
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="shield-checkmark"
                size={16}
                color={isDark ? "#22d3ee" : "#0ea5e9"}
              />
              <Text
                className={`ml-2 text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Your profile is end-to-end encrypted
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}