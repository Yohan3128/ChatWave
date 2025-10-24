import {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSingleChat } from "../socket/UseSingleChat";
import { Chat } from "../socket/chat";
import { formatChatTime } from "../util/DateFormatter";
import { useSendChat } from "../socket/UseSendChat";
import { useTheme } from "../theme/ThemeProvider";

type SingleChatScreenProps = NativeStackScreenProps<
  RootStack,
  "SingleChatScreen"
>;

export default function SingleChatScreen({
  route,
  navigation,
}: SingleChatScreenProps) {
  const { chatId, friendName, profileImage } = route.params;
  const singleChat = useSingleChat(chatId);
  const messages = singleChat.messages;
  const friend = singleChat.friend;
  const sendMessage = useSendChat();
  const [input, setInput] = useState("");
  const { applied } = useTheme();

  const isDark = applied === "dark";

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: {
        backgroundColor: isDark ? "#0a0e27" : "#ffffff",
      },
      headerLeft: () => (
        <View className="flex-row items-center gap-2">
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
          <TouchableOpacity className="h-12 w-12 rounded-full justify-center items-center">
            <Image
              source={{ uri: profileImage }}
              className="h-12 w-12 rounded-full"
            />
          </TouchableOpacity>
          <View className="space-y-1">
            <Text
              className={`font-bold text-lg ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {friend ? friend.firstName + " " + friend.lastName : friendName}
            </Text>
            <Text
              className={`italic text-xs font-medium ${
                isDark ? "text-cyan-400" : "text-cyan-600"
              }`}
            >
              {friend?.status === "ONLINE"
                ? "Online"
                : `Last seen ${formatChatTime(friend?.updatedAt ?? "")}`}
            </Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity>
          <Ionicons
            name="ellipsis-vertical"
            size={24}
            color={isDark ? "#22d3ee" : "#0ea5e9"}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, friend, isDark, profileImage, friendName,messages]);

  const renderItem = ({ item }: { item: Chat }) => {
    const isMe = item.from.id !== chatId;
    return (
      <View
        className={`my-1 px-4 py-3 max-w-[75%] ${
          isMe
            ? "self-end rounded-tl-2xl rounded-bl-2xl rounded-br-2xl"
            : "rounded-tr-2xl rounded-bl-2xl rounded-br-2xl self-start"
        }`}
        style={
          isMe
            ? {
                backgroundColor: isDark ? "#0891b2" : "#06b6d4",
                shadowColor: "#06b6d4",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
                elevation: 3,
              }
            : {
                backgroundColor: isDark ? "#334155" : "#e2e8f0",
              }
        }
      >
        <Text
          className={`text-base ${
            isMe ? "text-white" : isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {item.message}
        </Text>
        <View className="flex-row justify-end items-center mt-1">
          <Text
            className={`italic text-xs me-2 ${
              isMe
                ? "text-cyan-50"
                : isDark
                ? "text-slate-400"
                : "text-slate-600"
            }`}
          >
            {formatChatTime(item.createdAt)}
          </Text>
          {isMe && (
            <Ionicons
              name={
                item.status === "READ"
                  ? "checkmark-done-sharp"
                  : item.status === "DELIVERED"
                  ? "checkmark-done-sharp"
                  : "checkmark"
              }
              size={18}
              color={item.status === "READ" ? "#ffffff" : "#e0f2fe"}
            />
          )}
        </View>
      </View>
    );
  };

  setTimeout(() => {
    [messages,friend,singleChat]
  }, 2000);
  const handleSendChat = () => {
    if (!input.trim()) {
      return;
    }
    sendMessage(chatId, input);
    setInput("");
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-[#0a0e27]" : "bg-slate-50"}`}
      edges={["right", "bottom", "left"]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#0a0e27" : "#ffffff"}
      />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 100}
      >
        <FlatList
          data={messages}
          renderItem={renderItem}
          className="px-3 flex-1"
          inverted
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={{ paddingBottom: 60 }}
        />
        <View
          className={`flex-row items-end p-3 ${
            isDark ? "bg-[#0a0e27]" : "bg-white"
          }`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 5,
          }}
        >
          <TextInput
            value={input}
            onChangeText={(text) => setInput(text)}
            multiline
            placeholder="Type a message..."
            placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
            className={`flex-1 min-h-12 max-h-32 h-auto px-5 py-3 rounded-3xl text-base ${
              isDark
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-900"
            }`}
          />
          <TouchableOpacity
            className="w-12 h-12 items-center justify-center rounded-full ml-2"
            style={{
              backgroundColor: "#22d3ee",
              shadowColor: "#06b6d4",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 4,
              elevation: 5,
            }}
            onPress={handleSendChat}
          >
            <Ionicons name="send" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}