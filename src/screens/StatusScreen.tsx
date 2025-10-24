import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";
import { useState } from "react";

interface Status {
  id: string;
  userName: string;
  userImage: string;
  timestamp: string;
  isViewed: boolean;
  statusCount: number;
}

export default function StatusScreen() {
  const { applied } = useTheme();
  const isDark = applied === "dark";

  // Mock data - replace with your actual data
  const [myStatus] = useState({
    id: "my-status",
    userName: "My Status",
    userImage: "https://ui-avatars.com/api/?name=My+Status&background=22d3ee",
    timestamp: "Tap to add status",
    hasStatus: false,
  });

  const [statuses] = useState<Status[]>([
    {
      id: "1",
      userName: "John Doe",
      userImage: "https://ui-avatars.com/api/?name=John+Doe&background=random",
      timestamp: "2h ago",
      isViewed: false,
      statusCount: 3,
    },
    {
      id: "2",
      userName: "Jane Smith",
      userImage:
        "https://ui-avatars.com/api/?name=Jane+Smith&background=random",
      timestamp: "5h ago",
      isViewed: false,
      statusCount: 1,
    },
    {
      id: "3",
      userName: "Mike Johnson",
      userImage:
        "https://ui-avatars.com/api/?name=Mike+Johnson&background=random",
      timestamp: "8h ago",
      isViewed: true,
      statusCount: 2,
    },
    {
      id: "4",
      userName: "Sarah Williams",
      userImage:
        "https://ui-avatars.com/api/?name=Sarah+Williams&background=random",
      timestamp: "12h ago",
      isViewed: true,
      statusCount: 4,
    },
    {
      id: "5",
      userName: "David Brown",
      userImage:
        "https://ui-avatars.com/api/?name=David+Brown&background=random",
      timestamp: "15h ago",
      isViewed: false,
      statusCount: 2,
    },
  ]);

  const recentStatuses = statuses.filter((s) => !s.isViewed);
  const viewedStatuses = statuses.filter((s) => s.isViewed);

  const renderMyStatus = () => (
    <TouchableOpacity
      className={`flex-row items-center p-4 mx-3 my-2 rounded-2xl ${
        isDark ? "bg-slate-800/80" : "bg-white"
      }`}
      style={{
        shadowColor: isDark ? "#06b6d4" : "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 3,
        elevation: 3,
      }}
    >
      <View className="relative">
        <Image
          source={{ uri: myStatus.userImage }}
          className="h-16 w-16 rounded-full"
        />
        <View
          className="absolute bottom-0 right-0 h-6 w-6 bg-cyan-500 rounded-full justify-center items-center"
          style={{
            borderWidth: 3,
            borderColor: isDark ? "#1e293b" : "#ffffff",
          }}
        >
          <Ionicons name="add" size={16} color="white" />
        </View>
      </View>
      <View className="flex-1 ms-4">
        <Text
          className={`font-bold text-lg ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {myStatus.userName}
        </Text>
        <Text
          className={`text-sm mt-1 ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {myStatus.timestamp}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderStatusItem = ({ item }: { item: Status }) => (
    <TouchableOpacity
      className={`flex-row items-center px-4 py-3 mx-3 my-1 rounded-xl ${
        isDark ? "bg-slate-800/50" : "bg-white"
      }`}
      style={{
        shadowColor: isDark ? "#06b6d4" : "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.2 : 0.05,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <View className="relative">
        <View
          className={`h-16 w-16 rounded-full justify-center items-center ${
            item.isViewed
              ? "border-2 border-slate-400"
              : "border-3 border-cyan-500"
          }`}
          style={{
            borderWidth: item.isViewed ? 2 : 3,
            borderColor: item.isViewed
              ? isDark
                ? "#64748b"
                : "#94a3b8"
              : "#22d3ee",
          }}
        >
          <Image
            source={{ uri: item.userImage }}
            className="h-14 w-14 rounded-full"
          />
        </View>
        {item.statusCount > 1 && (
          <View
            className="absolute bottom-0 right-0 h-5 w-5 bg-cyan-500 rounded-full justify-center items-center"
            style={{
              borderWidth: 2,
              borderColor: isDark ? "#0a0e27" : "#f8fafc",
            }}
          >
            <Text className="text-white text-xs font-bold">
              {item.statusCount}
            </Text>
          </View>
        )}
      </View>
      <View className="flex-1 ms-4">
        <Text
          className={`font-bold text-base ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {item.userName}
        </Text>
        <Text
          className={`text-sm mt-1 ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {item.timestamp}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-[#0a0e27]" : "bg-slate-50"}`}
      edges={["right", "bottom", "left"]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#0a0e27" : "#f8fafc"}
      />

      {/* Header */}
      <View
        className={`px-4 py-4 ${isDark ? "bg-[#0a0e27]" : "bg-slate-50"}`}
      >
        <View className="flex-row items-center justify-between">
          <Text
            className={`font-bold text-2xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Status
          </Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity className="h-10 w-10 rounded-full justify-center items-center">
              <Ionicons
                name="search"
                size={24}
                color={isDark ? "#22d3ee" : "#0ea5e9"}
              />
            </TouchableOpacity>
            <TouchableOpacity className="h-10 w-10 rounded-full justify-center items-center">
              <Ionicons
                name="ellipsis-vertical"
                size={24}
                color={isDark ? "#22d3ee" : "#0ea5e9"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={[]}
        ListHeaderComponent={
          <View>
            {/* My Status */}
            {renderMyStatus()}

            {/* Privacy Info */}
            <View className="px-4 py-3">
              <View
                className={`flex-row items-center p-3 rounded-xl ${
                  isDark ? "bg-slate-800/50" : "bg-cyan-50"
                }`}
              >
                <Ionicons
                  name="lock-closed"
                  size={18}
                  color={isDark ? "#22d3ee" : "#0ea5e9"}
                />
                <Text
                  className={`flex-1 ms-3 text-sm ${
                    isDark ? "text-slate-400" : "text-slate-700"
                  }`}
                >
                  Status updates disappear after 24 hours
                </Text>
              </View>
            </View>

            {/* Recent Updates */}
            {recentStatuses.length > 0 && (
              <View className="mt-2">
                <Text
                  className={`px-4 py-2 font-bold text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  RECENT UPDATES
                </Text>
                {recentStatuses.map((item) => (
                  <View key={item.id}>{renderStatusItem({ item })}</View>
                ))}
              </View>
            )}

            {/* Viewed Updates */}
            {viewedStatuses.length > 0 && (
              <View className="mt-4">
                <Text
                  className={`px-4 py-2 font-bold text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  VIEWED UPDATES
                </Text>
                {viewedStatuses.map((item) => (
                  <View key={item.id}>{renderStatusItem({ item })}</View>
                ))}
              </View>
            )}

            {/* Empty State */}
            {statuses.length === 0 && (
              <View className="flex-1 justify-center items-center py-20">
                <View
                  className={`h-24 w-24 rounded-full justify-center items-center mb-4 ${
                    isDark ? "bg-slate-800" : "bg-cyan-50"
                  }`}
                >
                  <Ionicons
                    name="camera"
                    size={40}
                    color={isDark ? "#22d3ee" : "#0ea5e9"}
                  />
                </View>
                <Text
                  className={`font-bold text-xl mb-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  No Status Updates
                </Text>
                <Text
                  className={`text-center px-8 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Status updates from your contacts will appear here
                </Text>
              </View>
            )}
          </View>
        }
        renderItem={null}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Floating Camera Button */}
      <View className="absolute bottom-20 right-6">
        <TouchableOpacity
          className="h-16 w-16 rounded-2xl justify-center items-center"
          style={{
            backgroundColor: "#22d3ee",
            shadowColor: "#06b6d4",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="camera" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Floating Pencil Button (for text status) */}
      <View className="absolute bottom-20 right-28">
        <TouchableOpacity
          className="h-12 w-12 rounded-xl justify-center items-center"
          style={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            shadowColor: "#06b6d4",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
            borderWidth: 2,
            borderColor: "#22d3ee",
          }}
        >
          <Ionicons
            name="pencil"
            size={20}
            color={isDark ? "#22d3ee" : "#0ea5e9"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}