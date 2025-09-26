import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, Share, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookById } from '../../components/Slice/bookGetSlice.js';
import { useLocalSearchParams } from "expo-router";

const BookDetails = () => {
  const { bookId } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { book, loading, error } = useSelector((state) => state.allbooks);

  useEffect(() => {
    if (bookId) dispatch(fetchBookById(bookId));
  }, [bookId, dispatch]);

  const renderStars = (rating) => (
    Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={`star-${index}`}
        name={index < rating ? "star" : "star-outline"}
        size={20}
        color={index < rating ? "#FFA500" : "#E5E5E5"}
      />
    ))
  );

  const handleShare = async () => {
    if (!book) return Alert.alert("Error", "Book details are not available.");
    const shareMessage = `Check out this book: "${book.title}" on BookWorm!\n\nRating: ${"⭐".repeat(book.rating)}\nDescription: ${book.caption || book.description}\n\n#BookWorm #BookRecommendation`;
    try {
      await Share.share({ message: shareMessage, url: book.image, title: `${book.title} - BookWorm` });
    } catch (error) {
      Alert.alert("Error", "Unable to share this book. Please try again.");
    }
  };

  if (loading) return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="text-gray-600 mt-4 text-lg">Loading book details...</Text>
      </View>
    </SafeAreaView>
  );

  if (error || !book) {
    const errorMessage = error || "No book details available";
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name={error ? "alert-circle-outline" : "book-outline"} size={64} color={error ? "#EF4444" : "#9CA3AF"} />
          <Text className="text-red-500 text-lg font-semibold mt-4 text-center">{errorMessage}</Text>
          <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-lg mt-6" onPress={() => router.back()}>
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white pt-4"> {/* Added padding top here */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View className="bg-white px-4 py-4 border-b border-gray-100 flex-row items-center shadow-sm">
  <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full" activeOpacity={0.7}>
    <Ionicons name="arrow-back" size={24} color="#374151" />
  </TouchableOpacity>
  <Text className="text-lg font-semibold text-gray-800 ml-4">Book Details</Text>
</View>


      <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false} bounces={true}>
        <View className="bg-white px-6 pt-6 pb-4">
          <View className="items-center">
            <Image source={{ uri: book.image }} className="w-56 h-80 rounded-2xl shadow-lg" resizeMode="cover" />
          </View>
        </View>

        <View className="bg-white mx-4 mt-4 rounded-2xl shadow-sm border border-gray-100 p-6">
          <Text className="text-3xl font-bold text-gray-900 mb-3 text-center leading-tight">{book.title}</Text>
          <View className="flex-row items-center justify-center mb-6">
            <View className="flex-row items-center bg-gray-50 px-4 py-2 rounded-full">
              {renderStars(book.rating)}
              <Text className="text-gray-700 ml-2 font-semibold text-lg">{book.rating}/5</Text>
            </View>
          </View>

          <View className="flex-row items-center justify-center mb-6 bg-gray-50 p-4 rounded-xl">

              <View className="ml-3">
                <Text className="text-gray-500 text-sm">
                  Shared by: <Text className="text-gray-800 font-bold text-lg">{book.user?.username || "Unknown User"}</Text>
                </Text>
              </View>

           
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Description</Text>
            <Text className="text-gray-600 leading-relaxed text-base">{book.caption || book.description || "No description available."}</Text>
          </View>

          <View className="border-t border-gray-100 pt-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
                <Text className="text-gray-500 text-sm ml-2">Added on</Text>
              </View>
              <Text className="text-gray-700 font-medium">{new Date(book.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
            </View>
          </View>
        </View>

        <View className="px-4 py-6">
          <TouchableOpacity className="bg-blue-600 py-4 rounded-2xl shadow-sm" onPress={handleShare} activeOpacity={0.8}>
            <View className="flex-row items-center justify-center">
              <Ionicons name="share-outline" size={20} color="white" />
              <Text className="text-white font-bold text-lg ml-2">Share This Book</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookDetails;