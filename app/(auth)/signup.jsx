import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../components/Slice/authSlice.js";

const Signup = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = () => {
    const userData = { username: name, email, password };
    dispatch(register(userData));
  };

  useEffect(() => {
    if (user) {
      router.push("/(auth)");
    }
  }, [user]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, backgroundColor: "#ECFDF5" }}
        >
          <View className="flex-1 justify-center items-center px-6">
            <View className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-lg">
              <View className="mb-12 items-center">
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={{ fontSize: 24, fontFamily: "monospace", letterSpacing: 2, color: "#22c55e", fontWeight: "600" }}>
                      BookStore
                    </Text>
                    <Text style={{ fontSize: 24, color: "#22c55e" }}>📚</Text>
                  </View>
                  <Text className="text-gray-400 text-m font-medium mb-2">
                    Share Your Favourite Reads
                  </Text>
                </View>
                <Image
                  source={require("../../assets/images/bookimage.png")}
                  style={{ width: 300, height: 200, marginBottom: 0 }}
                  resizeMode="contain"
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 text-sm font-medium mb-2">Name</Text>
                <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                  <Ionicons name="person-circle" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-700 text-base"
                    placeholder="Enter your name"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
                    keyboardType="default"
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 text-sm font-medium mb-2">Email</Text>
                <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                  <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-700 text-base"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-gray-700 text-sm font-medium mb-2">Password</Text>
                <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-700 text-base"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSignup}
                className="bg-green-500 rounded-lg py-4 items-center mb-4 shadow-sm active:bg-green-600"
              >
                <Text className="text-white font-semibold text-base">Sign Up</Text>
              </TouchableOpacity>

              <View className="flex-row justify-center">
                <Text className="text-gray-600 text-sm">Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)")}>
                  <Text className="text-green-500 text-sm font-semibold">Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Signup;
