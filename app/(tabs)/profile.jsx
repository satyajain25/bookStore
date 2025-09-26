// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   SafeAreaView,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUserWithBooks, deleteUserBook } from '../../components/Slice/userSlice.js';

// const Profile = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { user, recommendedBooks = [], loading, error } = useSelector(state => state.user);

//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     dispatch(fetchUserWithBooks());
//   }, [dispatch]);

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     dispatch(fetchUserWithBooks()).finally(() => setRefreshing(false));
//   }, [dispatch]);

//   const handleLogout = () => {
//     Alert.alert(
//       "Logout",
//       `${user?.username}, Are you sure you want to logout ?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Logout",
//           onPress: () => router.push("/(auth)"),
//           style: "destructive"
//         }
//       ]
//     );
//   };

//   const handleEditProfile = () => {
//     router.push('/screens/profileUpdate');
//   };

//   const handleDeleteBook = (bookId) => {
//     Alert.alert(
//       "Delete Book",
//       "Are you sure you want to delete this book?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           onPress: () => dispatch(deleteUserBook(bookId)).then(() => dispatch(fetchUserWithBooks())),
//           style: "destructive"
//         }
//       ]
//     );
//   };

//   const renderStars = (rating) => {
//     const rounded = Math.round(rating);
//     return Array.from({ length: 5 }, (_, index) => (
//       <Ionicons
//         key={index}
//         name={index < rounded ? 'star' : 'star-outline'}
//         size={14}
//         color={index < rounded ? '#FFA500' : '#E5E5E5'}
//       />
//     ));
//   };

//   const BookRecommendation = ({ book }) => (
//     <View className="flex-row bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
//       <Image
//         source={{ uri: book.image }}
//         className="w-16 h-20 rounded-lg mr-4"
//         resizeMode="cover"
//       />
//       <View className="flex-1">
//         <Text className="text-lg font-semibold text-gray-900 mb-1">{book.title}</Text>
//         <View className="flex-row items-center mb-2">
//           {renderStars(book.rating)}
//         </View>
//         <Text className="text-gray-600 text-sm mb-2 leading-5">{book.caption}</Text>
//         <Text className="text-gray-400 text-xs">{new Date(book.createdAt).toLocaleDateString()}</Text>
//       </View>
//       <TouchableOpacity onPress={() => handleDeleteBook(book._id)}>
//         <Ionicons name="trash-outline" size={20} color="#EF4444" />
//       </TouchableOpacity>
//     </View>
//   );

//   if (loading && !refreshing) {
//     return (
//       <View className="flex-1 justify-center items-center bg-white">
//         <ActivityIndicator size="large" color="#059669" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <Text className="text-red-500">{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       <ScrollView
//         className="flex-1"
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#059669']}
//             tintColor="#059669"
//           />
//         }
//       >
//         {/* Profile Info */}
//         <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm border border-gray-100">
//           <TouchableOpacity onPress={handleEditProfile} activeOpacity={0.7} className="items-center">
//             <View className="items-center mb-4">
//               <View className="relative w-24 h-24">
//                 {user?.profileImage ? (
//                   <Image
//                     source={{ uri: user.profileImage }}
//                     className="w-24 h-24 rounded-full border-4 border-[#059669]"
//                     resizeMode="cover"
//                   />
//                 ) : (
//                   <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center border-4 border-[#059669]">
//                     <Ionicons name="person" size={50} color="#059669" />
//                   </View>
//                 )}
//                 <View className="absolute bottom-0 right-0 bg-gray-600 rounded-full p-1">
//                   <Ionicons name="pencil" size={12} color="white" />
//                 </View>
//               </View>
//             </View>
//             <View className="items-center mb-6">
//               <View className="flex-row items-center">
//                 <Text className="text-2xl font-bold text-gray-900 mb-1">{user?.username}</Text>
//                 <Ionicons name="chevron-forward" size={16} color="#9CA3AF" className="ml-1" />
//               </View>
//               <Text className="text-gray-500 text-base mb-1">{user?.email}</Text>
//               <Text className="text-gray-400 text-xs mt-1">Tap to edit profile</Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity
//             className="bg-[#059669] rounded-xl py-4 flex-row items-center justify-center"
//             onPress={handleLogout}
//           >
//             <Ionicons name="log-out-outline" size={20} color="white" />
//             <Text className="text-white font-semibold text-lg ml-2">Logout</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Book List */}
//         <View className="mt-6 mx-4">
//           <View className="flex-row items-center justify-between mb-4">
//             <Text className="text-xl font-bold text-gray-800">Your Recommendations</Text>
//             <View className="bg-gray-200 rounded-full px-3 py-1">
//               <Text className="text-gray-600 text-sm font-medium">
//                 {recommendedBooks.length} book{recommendedBooks.length !== 1 ? 's' : ''}
//               </Text>
//             </View>
//           </View>

//           <View>
//             {recommendedBooks.length === 0 ? (
//               <Text className="text-gray-500 text-center">No books recommended yet.</Text>
//             ) : (
//               recommendedBooks.map((book) => (
//                 <BookRecommendation key={book._id} book={book} />
//               ))
//             )}
//           </View>
//         </View>

//         <View className="h-6" />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Profile;
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBooks } from '../../components/Slice/bookGetSlice';
import { deleteUserBook, fetchUserWithBooks } from '../../components/Slice/userSlice';

const Profile = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user, recommendedBooks = [], loading, error } = useSelector((state) => state.user);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchUserWithBooks());
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchUserWithBooks()).finally(() => setRefreshing(false));
  }, [dispatch]);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      `${user?.username}, are you sure you want to logout?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: () => router.replace("/(auth)"),
          style: "destructive"
        }
      ]
    );
  };

  const handleEditProfile = () => {
    router.push('/screens/profileUpdate');
  };

  // In Profile component, after deleting a book
  const handleDeleteBook = async (bookId) => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await dispatch(deleteUserBook(bookId)).unwrap();
              // Fetch updated user data after deletion
              dispatch(fetchUserWithBooks());
              // Optionally, fetch all books to update the Home screen
              dispatch(fetchAllBooks());
            } catch (err) {
              Alert.alert("Error", "Failed to delete book. Please try again.");
              console.error(err);
            }
          },
          style: "destructive"
        }
      ]
    );
  };


  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rounded ? 'star' : 'star-outline'}
        size={14}
        color={index < rounded ? '#FFA500' : '#E5E5E5'}
      />
    ));
  };

  const BookRecommendation = ({ book }) => (
    <View className="flex-row bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
      <Image
        source={{ uri: book.image }}
        className="w-16 h-20 rounded-lg mr-4"
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-900 mb-1">{book.title}</Text>
        <View className="flex-row items-center mb-2">
          {renderStars(book.rating)}
        </View>
        <Text className="text-gray-600 text-sm mb-2 leading-5">{book.caption}</Text>
        <Text className="text-gray-400 text-xs">{new Date(book.createdAt).toLocaleDateString()}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteBook(book._id)}>
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#059669']}
            tintColor="#059669"
          />
        }
      >
        {/* Profile Info */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm border border-gray-100">
          <TouchableOpacity onPress={handleEditProfile} activeOpacity={0.7} className="items-center">
            <View className="items-center mb-4">
              <View className="relative w-24 h-24">
                {user?.profileImage ? (
                  <Image
                    source={{ uri: user.profileImage }}
                    className="w-24 h-24 rounded-full border-4 border-[#059669]"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center border-4 border-[#059669]">
                    <Ionicons name="person" size={50} color="#059669" />
                  </View>
                )}
                <View className="absolute bottom-0 right-0 bg-gray-600 rounded-full p-1">
                  <Ionicons name="pencil" size={12} color="white" />
                </View>
              </View>
            </View>
            <View className="items-center mb-6">
              <View className="flex-row items-center">
                <Text className="text-2xl font-bold text-gray-900 mb-1">{user?.username}</Text>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" className="ml-1" />
              </View>
              <Text className="text-gray-500 text-base mb-1">{user?.email}</Text>
              <Text className="text-gray-400 text-xs mt-1">Tap to edit profile</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-[#059669] rounded-xl py-4 flex-row items-center justify-center"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className="text-white font-semibold text-lg ml-2">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Book List */}
        <View className="mt-6 mx-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-800">Your Recommendations</Text>
            <View className="bg-gray-200 rounded-full px-3 py-1">
              <Text className="text-gray-600 text-sm font-medium">
                {recommendedBooks.length} book{recommendedBooks.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          <View>
            {recommendedBooks.length === 0 ? (
              <Text className="text-gray-500 text-center">No books recommended yet.</Text>
            ) : (
              recommendedBooks.map((book) => (
                <BookRecommendation key={book._id} book={book} />
              ))
            )}
          </View>
        </View>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
