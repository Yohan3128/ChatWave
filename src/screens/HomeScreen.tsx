import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useChatList } from "../socket/UseChatList";
import { formatChatTime } from "../util/DateFormatter";
import { Chat } from "../socket/chat";
import { AuthContext } from "../components/AuthProvider";
import { useTheme } from "../theme/ThemeProvider";

type HomeScreenProps = NativeStackNavigationProp<RootStack, "HomeScreen">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProps>();
  const [search, setSearch] = useState("");
  const chatList = useChatList();
  const [isModalVisible, setModalVisible] = useState(false);
  const auth = useContext(AuthContext);
  const { applied } = useTheme();

  const isDark = applied === "dark";

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View
          className={`h-20 justify-center items-center flex-row shadow-lg ${
            isDark ? "bg-[#0a0e27]" : "bg-white"
          } ${Platform.OS === "ios" ? `py-5` : `py-0`}`}
          style={{
            shadowColor: isDark ? "#06b6d4" : "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowRadius: 3.84,
            elevation: 10,
            alignItems: "flex-end",
          }}
        >
          <View className="flex-1 items-start ms-3">
            <Text
              className={`font-bold text-2xl ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Chat<Text className="text-cyan-400">Wave</Text>
            </Text>
          </View>
          <View className="me-3">
            <View className="flex-row space-x-4">
              <TouchableOpacity className="me-5">
                <Ionicons
                  name="camera"
                  size={26}
                  color={isDark ? "#22d3ee" : "#0ea5e9"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Ionicons
                  name="ellipsis-vertical"
                  size={24}
                  color={isDark ? "#22d3ee" : "#0ea5e9"}
                />
              </TouchableOpacity>
              <Modal
                animationType="fade"
                visible={isModalVisible}
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
              >
                <Pressable
                  className="flex-1 bg-black/50"
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <View className="justify-end items-end p-5">
                      <View
                        className={`rounded-xl w-60 p-2 ${
                          isDark ? "bg-slate-800" : "bg-white"
                        }`}
                        style={{
                          shadowColor: isDark ? "#06b6d4" : "#000",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: isDark ? 0.4 : 0.25,
                          shadowRadius: 5,
                          elevation: 8,
                        }}
                      >
                        <TouchableOpacity
                          className={`h-14 px-4 my-1 justify-center rounded-lg ${
                            isDark
                              ? "border-b border-b-slate-700"
                              : "border-b border-b-gray-100"
                          }`}
                          onPress={() => {
                            navigation.navigate("SettingScreen");
                            setModalVisible(false);
                          }}
                        >
                          <View className="flex-row items-center">
                            <Ionicons
                              name="settings-outline"
                              size={20}
                              color={isDark ? "#22d3ee" : "#0ea5e9"}
                            />
                            <Text
                              className={`font-semibold text-base ms-3 ${
                                isDark ? "text-white" : "text-slate-900"
                              }`}
                            >
                              Settings
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className={`h-14 px-4 my-1 justify-center rounded-lg ${
                            isDark
                              ? "border-b border-b-slate-700"
                              : "border-b border-b-gray-100"
                          }`}
                          onPress={() => {
                            navigation.navigate("ProfileScreen");
                            setModalVisible(false);
                          }}
                        >
                          <View className="flex-row items-center">
                            <Ionicons
                              name="person-outline"
                              size={20}
                              color={isDark ? "#22d3ee" : "#0ea5e9"}
                            />
                            <Text
                              className={`font-semibold text-base ms-3 ${
                                isDark ? "text-white" : "text-slate-900"
                              }`}
                            >
                              My Profile
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="h-14 px-4 my-1 justify-center rounded-lg"
                          onPress={() => {
                            if (auth) auth.signOut();
                          }}
                        >
                          <View className="flex-row items-center">
                            <Ionicons
                              name="log-out-outline"
                              size={20}
                              color="#ef4444"
                            />
                            <Text className="font-semibold text-base ms-3 text-red-500">
                              Log Out
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Pressable>
                </Pressable>
              </Modal>
            </View>
          </View>
        </View>
      ),
    });
  }, [navigation, isModalVisible, chatList, isDark]);

  setTimeout(() => {
    chatList;
  }, 2000);

  const filterdChats = [...chatList]
    .filter((chat) => {
      return (
        chat.friendName.toLowerCase().includes(search.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort(
      (a, b) =>
        new Date(b.lastTimeStamp).getTime() -
        new Date(a.lastTimeStamp).getTime()
    );

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      className={`flex-row items-center py-3 px-4 my-1 mx-2 rounded-xl ${
        isDark ? "bg-slate-800/80" : "bg-white"
      }`}
      style={{
        shadowColor: isDark ? "#06b6d4" : "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.2 : 0.05,
        shadowRadius: 2,
        elevation: 2,
      }}
      onPress={() => {
        navigation.navigate("SingleChatScreen", {
          chatId: item.friendId,
          friendName: item.friendName,
          lastSeenTime: formatChatTime(item.lastTimeStamp),
          profileImage: item.profileImage
            ? item.profileImage
            : `https://ui-avatars.com/api/?name=${item.friendName.replace(
                " ",
                "+"
              )}&background=random`,
        });
      }}
    >
      <View className="relative">
        <TouchableOpacity className="h-14 w-14 rounded-full justify-center items-center">
          {item.profileImage ? (
            <Image
              source={{ uri: item.profileImage }}
              className="h-14 w-14 rounded-full"
            />
          ) : (
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${item.friendName.replace(
                  " ",
                  "+"
                )}&background=random`,
              }}
              className="h-14 w-14 rounded-full"
            />
          )}
        </TouchableOpacity>
        {/* Online Status Indicator */}
        <View className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white" />
      </View>
      <View className="flex-1 ms-3">
        <View className="flex-row justify-between items-center">
          <Text
            className={`font-bold text-lg ${
              isDark ? "text-white" : "text-slate-900"
            }`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.friendName}
          </Text>
          <Text
            className={`font-medium text-xs ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {formatChatTime(item.lastTimeStamp)}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mt-1">
          <Text
            className={`flex-1 text-sm ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View className="bg-cyan-500 rounded-full px-2 py-1 ms-2 min-w-[24px] items-center">
              <Text className="text-white text-xs font-bold">
                {item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className={`flex-1 p-0 ${isDark ? "bg-[#0a0e27]" : "bg-slate-50"}`}
      edges={["right", "bottom", "left"]}
    >
      <StatusBar hidden={false}
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#0a0e27" : "#ffffff"}
      />
      <View
        className={`items-center flex-row mx-3 rounded-2xl px-4 h-12 mt-3 ${
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
          name="search"
          size={20}
          color={isDark ? "#22d3ee" : "#0ea5e9"}
        />
        <TextInput
          className={`flex-1 text-base font-medium ps-3 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
          placeholder="Search chats..."
          placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
      </View>
      <View className="mt-2 flex-1">
        <FlatList
          data={filterdChats}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>
      <View className="absolute bottom-2 right-6">
        <TouchableOpacity
          className="h-16 w-16 rounded-2xl justify-center items-center bg-gradient-to-br from-cyan-400 to-blue-600"
          style={{
            shadowColor: "#06b6d4",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 8,
            backgroundColor: "#22d3ee",
          }}
          onPress={() => navigation.navigate("NewChatScreen")}
        >
          <Ionicons name="chatbox-ellipses" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
