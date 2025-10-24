import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useContext, useState } from "react";
import { useUserRegistration } from "../components/UserContext";
import { validateProfileImage } from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { createNewAccount } from "../api/UserService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../components/AuthProvider";
import { useTheme } from "../theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

type AvataScreenProps = NativeStackNavigationProp<RootStack, "AvatarScreen">;

export default function AvatarScreen() {
  const navigation = useNavigation<AvataScreenProps>();
  const [loading, setLoading] = useState(false);
  const { applied } = useTheme();
  const isDark = applied === "dark";

  const [image, setImage] = useState<string | null>(null);

  const { userData, setUserData } = useUserRegistration();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setUserData((previous) => ({
        ...previous,
        profileImage: result.assets[0].uri,
      }));
    }
  };

  const avatars = [
    require("../../assets/avatar/avatar_1.png"),
    require("../../assets/avatar/avatar_2.png"),
    require("../../assets/avatar/avatar_3.png"),
    require("../../assets/avatar/avatar_4.png"),
    require("../../assets/avatar/avatar_5.png"),
    require("../../assets/avatar/avatar_6.png"),
  ];

  const auth = useContext(AuthContext);

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-[#0a0e27]" : "bg-slate-50"}`}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#0a0e27" : "#f8fafc"}
      />
      <View className="flex-1 items-center px-5 mt-30">
        {/* Title Section */}
        <View className="items-center mt-36">
          <Text
            className={`font-bold text-3xl mb-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Profile Picture
          </Text>
          <Text
            className={`text-base text-center ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Choose a profile image to complete your account
          </Text>
        </View>

        <View className="items-center flex-1">
          {/* Profile Image Picker */}
          <View className="items-center mt-4">
            <Pressable
              className="h-40 w-40 rounded-full justify-center items-center relative"
              style={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                shadowColor: "#06b6d4",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
              onPress={pickImage}
            >
              {image ? (
                <>
                  <Image
                    source={{ uri: image }}
                    className="h-40 w-40 rounded-full"
                    style={{
                      borderWidth: 4,
                      borderColor: "#22d3ee",
                    }}
                  />
                  <View
                    className="absolute bottom-2 right-2 w-12 h-12 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: "#22d3ee",
                      shadowColor: "#06b6d4",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.5,
                      shadowRadius: 4,
                      elevation: 6,
                    }}
                  >
                    <Ionicons name="camera" size={24} color="white" />
                  </View>
                </>
              ) : (
                <View className="items-center">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center mb-3"
                    style={{
                      backgroundColor: isDark ? "#22d3ee20" : "#22d3ee15",
                    }}
                  >
                    <Ionicons
                      name="camera"
                      size={32}
                      color={isDark ? "#22d3ee" : "#0ea5e9"}
                    />
                  </View>
                  <Text
                    className={`font-bold text-base ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Add Photo
                  </Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-8 w-full">
            <View
              className={`flex-1 h-px ${
                isDark ? "bg-slate-700" : "bg-slate-300"
              }`}
            />
            <Text
              className={`mx-4 font-semibold ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              OR
            </Text>
            <View
              className={`flex-1 h-px ${
                isDark ? "bg-slate-700" : "bg-slate-300"
              }`}
            />
          </View>

          {/* Avatar Selection Label */}
          <Text
            className={`text-base mb-4 font-semibold ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Select an Avatar
          </Text>

          {/* Avatar List */}
          <FlatList
            data={avatars}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setImage(Image.resolveAssetSource(item).uri);
                  setUserData((previous) => ({
                    ...previous,
                    profileImage: Image.resolveAssetSource(item).uri,
                  }));
                }}
                className="mx-2"
              >
                <Image
                  source={item}
                  className="h-20 w-20 rounded-full"
                  style={{
                    borderWidth: 3,
                    borderColor:
                      image === Image.resolveAssetSource(item).uri
                        ? "#22d3ee"
                        : isDark
                        ? "#334155"
                        : "#e2e8f0",
                  }}
                />
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Create Account Button */}
        <View className="mt-6 w-full mb-6">
          <Pressable
            disabled={loading ? true : false}
            className="h-14 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: loading ? "#64748b" : "#22d3ee",
              shadowColor: "#06b6d4",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: loading ? 0.2 : 0.5,
              shadowRadius: 8,
              elevation: 8,
            }}
            onPress={async () => {
              const validProfile = validateProfileImage(
                userData.profileImage
                  ? { uri: userData.profileImage, type: "", fileSize: 0 }
                  : null
              );
              if (validProfile) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: "Select a profile image or an avatar",
                });
              } else {
                try {
                  setLoading(true);
                  const response = await createNewAccount(userData);
                  if (response.status) {
                    const id = response.userId;
                    if (auth) {
                      await auth.signUp(String(id));
                    }
                  } else {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: "Warning",
                      textBody: response.message,
                    });
                  }
                } catch (error) {
                  console.log(error);
                } finally {
                  setLoading(false);
                }
              }
            }}
          >
            {loading ? (
              <ActivityIndicator size={"large"} color={"white"} />
            ) : (
              <View className="flex-row items-center">
                <Text className="font-bold text-lg text-white mr-2">
                  Create Account
                </Text>
                <Ionicons name="checkmark-circle" size={24} color="white" />
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
