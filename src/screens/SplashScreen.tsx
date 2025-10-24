import { useEffect } from "react";
import { Image, StatusBar, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import CircleShape from "../components/CircleShape";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useTheme } from "../theme/ThemeProvider";
import { useWebSocketPing } from "../socket/UseWebSocketPing";

type Props = NativeStackNavigationProp<RootStack, "SplashScreen">;

export default function SplashScreen() {
  const navigation = useNavigation<Props>();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const pulseScale = useSharedValue(1);
  const { applied } = useTheme();
  
  useWebSocketPing(60000);
  
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1200 });
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
    });
    
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      false
    );
    
    // const timer = setTimeout(() => {
    //   navigation.replace("SignUpScreen");
    // }, 3000);

    // return () => {
    //   clearTimeout(timer);
    // };
  }, [navigation, opacity, scale, pulseScale]);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value * pulseScale.value },
      ],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: withTiming(0, { duration: 1000 }) }],
    };
  });

  const logo = require("../../assets/ChatWaveLogo.png");

  const isDark = applied === "dark";

  return (
    <SafeAreaView 
      className={`flex-1 justify-center items-center ${
        isDark ? "bg-[#0a0e27]" : "bg-[#f8fafc]"
      }`}
    >
      <StatusBar 
        barStyle="light-content"
        backgroundColor={isDark ? "#0a0e27" : "#1e40af"}
      />
      
      {/* Large Background Circle - Top Right */}
      <CircleShape
        width={400}
        height={400}
        borderRadius={999}
        className={`${isDark ? "bg-blue-600/20" : "bg-blue-500/10"}`}
        topValue={-150}
        leftValue={150}
      />
      
      {/* Medium Background Circle - Top Left */}
      <CircleShape
        width={300}
        height={300}
        borderRadius={999}
        className={`${isDark ? "bg-cyan-500/15" : "bg-cyan-400/10"}`}
        topValue={-80}
        leftValue={-100}
      />
      
      {/* Small Background Circle - Bottom Right */}
      <CircleShape
        width={250}
        height={250}
        borderRadius={999}
        className={`${isDark ? "bg-blue-500/15" : "bg-blue-400/10"}`}
        topValue={500}
        leftValue={200}
      />
      
      {/* Small Background Circle - Bottom Left */}
      <CircleShape
        width={200}
        height={200}
        borderRadius={999}
        className={`${isDark ? "bg-cyan-400/10" : "bg-cyan-300/8"}`}
        topValue={450}
        leftValue={-60}
      />

      {/* Logo Container with Glow Rings */}
      <View className="justify-center items-center">
               
        {/* Logo */}
        <Animated.View 
          style={logoAnimatedStyle}
          className="justify-center items-center"
        >
          <Image 
            source={logo} 
            style={{ height: 200, width: 220 }} 
            resizeMode="contain"
          />
        </Animated.View>
        
        {/* App Name */}
        <Animated.View style={textAnimatedStyle} className="mt-6">
          <Text 
            className={`text-4xl font-bold tracking-wide text-center ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Chat<Text className="text-cyan-400">Wave</Text>
          </Text>
          <Text 
            className={`text-center text-sm mt-3 font-medium ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Connect • Chat • Collaborate
          </Text>
        </Animated.View>
      </View>


      {/* Bottom Info */}
      <Animated.View 
        className="absolute bottom-8 px-6" 
        style={textAnimatedStyle}
      >
        <View className="justify-center items-center space-y-2">
          <View className="h-1 w-12 rounded-full bg-cyan-400/60 mb-2" />
          <Text 
            className={`text-xs font-semibold tracking-widest ${
              isDark ? "text-slate-500" : "text-slate-600"
            }`}
          >
            DEVELOPED BY: {process.env.EXPO_PUBLIC_APP_OWNER}
          </Text>
          <Text 
            className={`text-xs font-medium ${
              isDark ? "text-slate-600" : "text-slate-500"
            }`}
          >
            VERSION: {process.env.EXPO_PUBLIC_APP_VERSION}
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}