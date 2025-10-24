import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { User } from "../socket/chat";
import { useUserList } from "../socket/UseUserList";
import { useTheme } from "../theme/ThemeProvider";

type NewChatScreenProp = NativeStackNavigationProp<RootStack, "NewChatScreen">;
export default function NewChatScreen() {
  const navigation = useNavigation<NewChatScreenProp>();
  const [search, setSearch] = useState("");
  const users = useUserList();
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
              Select Contact
            </Text>
            <Text
              className={`text-sm font-medium ${
                isDark ? "text-cyan-400" : "text-cyan-600"
              }`}
            >
              {users.length} contacts
            </Text>
          </View>
        </View>
      ),
      headerRight: () => <View></View>,
    });
  }, [navigation, users, isDark]);

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      className={`justify-start items-center gap-x-3 px-4 py-3 flex-row mx-2 my-1 rounded-xl ${
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
        navigation.replace("SingleChatScreen", {
          chatId: item.id,
          friendName: `${item.firstName} ${item.lastName}`,
          lastSeenTime: item.updatedAt,
          profileImage: item.profileImage
            ? item.profileImage
            : `https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}&background=random`,
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
                uri: `https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}&background=random`,
              }}
              className="h-14 w-14 rounded-full"
            />
          )}
        </TouchableOpacity>
        {/* Online Status Indicator */}
        {item.status === "ONLINE" && (
          <View
            className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full"
            style={{
              borderWidth: 2,
              borderColor: isDark ? "#0a0e27" : "#ffffff",
            }}
          />
        )}
      </View>
      <View className="flex-1 flex-col gap-y-1">
        <Text
          className={`font-bold text-lg ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {item.firstName} {item.lastName}
        </Text>
        <Text
          className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
        >
          {item.status === "ACTIVE"
            ? "Already in Friend List; Message Now"
            : "Hey there! I am using ChatWave"}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={isDark ? "#64748b" : "#94a3b8"}
      />
    </TouchableOpacity>
  );

  const filterdUsers = [...users]
    .filter((user) => {
      return (
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.contactNo.includes(search)
      );
    })
    .sort((a, b) => a.firstName.localeCompare(b.firstName));

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-[#0a0e27]" : "bg-slate-50"}`}
      edges={["right", "bottom", "left"]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#0a0e27" : "#ffffff"}
      />
      <View className="flex-1">
        {/* Search Bar */}
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
            placeholder="Search contacts..."
            placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
        </View>

        {/* New Contact Button */}
        <View className="px-3 my-3">
          <TouchableOpacity
            className={`justify-start gap-x-4 flex-row items-center px-4 py-3 rounded-xl ${
              isDark ? "bg-slate-800/80" : "bg-white"
            }`}
            style={{
              shadowColor: "#06b6d4",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
              elevation: 3,
              borderWidth: 1,
              borderColor: isDark ? "#22d3ee40" : "#22d3ee30",
            }}
            onPress={() => navigation.navigate("NewContactScreen")}
          >
            <View
              className="items-center justify-center w-12 h-12 rounded-full"
              style={{
                backgroundColor: "#22d3ee",
                shadowColor: "#06b6d4",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Feather name="user-plus" size={22} color="white" />
            </View>
            <Text
              className={`text-base font-bold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              New Contact
            </Text>
            <View className="flex-1" />
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? "#22d3ee" : "#0ea5e9"}
            />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View className="px-3 mb-2">
          <View
            className={`h-px ${
              isDark ? "bg-slate-700" : "bg-slate-200"
            }`}
          />
        </View>

        {/* Contact Count Header */}
        {filterdUsers.length > 0 && (
          <View className="px-4 py-2">
            <Text
              className={`text-sm font-bold ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              ALL CONTACTS ({filterdUsers.length})
            </Text>
          </View>
        )}

        {/* Contact List */}
        <View className="flex-1">
          <FlatList
            data={filterdUsers}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-20">
                <View
                  className={`h-24 w-24 rounded-full justify-center items-center mb-4 ${
                    isDark ? "bg-slate-800" : "bg-cyan-50"
                  }`}
                >
                  <Ionicons
                    name="people-outline"
                    size={40}
                    color={isDark ? "#22d3ee" : "#0ea5e9"}
                  />
                </View>
                <Text
                  className={`font-bold text-xl mb-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  No Contacts Found
                </Text>
                <Text
                  className={`text-center px-8 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {search
                    ? "Try a different search term"
                    : "Add your first contact to start chatting"}
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}