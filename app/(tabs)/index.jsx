import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBooks } from "../../components/Slice/bookGetSlice";

const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { allBooks, loading, error } = useSelector((state) => state.allbooks);


  const [refreshing, setRefreshing] = useState(false);

  const loadBooks = () => {
    // console.log('Home: Loading books with token:', token ? 'Token available' : 'No token');
    if (token) {
      dispatch(fetchAllBooks());
    }
  };

  useEffect(() => {
    loadBooks();
  }, [token,dispatch]);

  useEffect(() => {
    // console.log('Home: Books data updated:', allBooks);
  }, [allBooks]);
  

  const onRefresh = async () => {
    // console.log('Home: Refreshing books');
    setRefreshing(true);
    await dispatch(fetchAllBooks());
    setRefreshing(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? "star" : "star-outline"}
        size={16}
        color={index < rating ? "#FFA500" : "#E5E5E5"}
      />
    ));
  };

  const handleShare = async (post) => {
    try {
      // console.log('Home: Sharing book:', post.book.title);
      const shareMessage = `Check out this book: "${post.book.title}" shared by ${post.user.name} on BookStore!\n\nRating: ${"⭐".repeat(post.book.rating)}\nDescription: ${post.book.description}\n\n#BookStore #BookRecommendation`;

      const result = await Share.share({
        message: shareMessage,
        title: `${post.book.title} - BookStore`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type:", result.activityType);
        } else {
          console.log("Book shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert("Error", "Unable to share this book. Please try again.");
    }
  };

  const BookPost = ({ post }) => {
    return (
      <TouchableOpacity
        className="bg-white rounded-2xl mx-4 mb-6 shadow-sm border border-gray-100"
        onPress={() => router.push({ pathname: "./screens/BookDetails", params: { bookId: post.id } })}

        activeOpacity={0.9}
      >
        <View className="flex-row items-center p-4 pb-3">
          <Image
            source={{
              uri:
                post.user.avatar ||
                "https://dummyimage.com/100x100/ccc/fff&text=User",
            }}
            className="w-10 h-10 rounded-full border-2 border-gray-200"
            resizeMode="cover"
            onError={(error) => {
              console.log("Profile image error:", error);
            }}
          />
          <Text className="text-gray-800 font-semibold text-lg ml-3">
            {post.user.name}
          </Text>
        </View>

        <View className="px-4 pb-4">
          <Image
            source={{ uri: post.book.cover }}
            className="w-full h-48 rounded-xl"
            resizeMode="cover"
            onError={(error) => {
              console.log("Book cover error:", error);
            }}
          />
        </View>
        <View className="px-4 pb-4">
          <Text className="text-xl font-bold text-gray-900 mb-1">
            {post.book.title}
          </Text>
          <View className="flex-row items-center mb-2">
            {renderStars(post.book.rating)}
          </View>
          <Text className="text-gray-600 text-sm mb-2">
            {post.book.description}
          </Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400 text-xs">{post.book.date}</Text>
            <TouchableOpacity
              className="p-2 -m-2"
              onPress={() => handleShare(post)}
              activeOpacity={0.7}
            >
              <Ionicons name="share-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // console.log('Home: Rendering  component');
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-2xl font-bold text-gray-800">BookStore</Text>
            <Text className="text-2xl ml-1">📚</Text>
          </View>
          <TouchableOpacity className="p-2">
            <Ionicons name="notifications-outline" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        <Text className="text-sm text-gray-500 mt-1">
          Discover great reads from the community
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6366F1"]}
          />
        }
      >
        <View className="pt-4">
          {loading && (
            <ActivityIndicator size="large" color="#6366F1" className="mt-10" />
          )}
          {error && (
            <Text className="text-center text-red-500 mt-4">{error}</Text>
          )}
          {!loading && !error && allBooks?.length === 0 && (
            <Text className="text-center text-gray-500 mt-4">
              No books found.
            </Text>
          )}
          {allBooks?.map((book) => (
            <BookPost
              key={book._id}
              post={{
                id: book._id,
                user: {
                  name: book.user?.username || "Unknown User",
                  avatar:
                    book.user?.profileImage ||
                    "https://dummyimage.com/100x100/ccc/fff&text=User",
                },
                book: {
                  title: book.title,
                  cover: book.image,
                  rating: book.rating,
                  description: book.caption,
                  date: new Date(book.createdAt).toLocaleDateString(),
                },
              }}
            
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   RefreshControl,
//   SafeAreaView,
//   ScrollView,
//   Share,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllBooks } from "../../components/Slice/bookGetSlice";

// const Home = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { user, token } = useSelector((state) => state.auth);
//   const { allBooks, loading, error } = useSelector((state) => state.allbooks);

//   const [refreshing, setRefreshing] = useState(false);

//   const loadBooks = () => {
//     if (token) {
//       dispatch(fetchAllBooks());
//     }
//   };

//   useEffect(() => {
//     loadBooks();
//   }, [token]);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await dispatch(fetchAllBooks());
//     setRefreshing(false);
//   };

//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }, (_, index) => (
//       <Ionicons
//         key={index}
//         name={index < rating ? "star" : "star-outline"}
//         size={16}
//         color={index < rating ? "#FFA500" : "#E5E5E5"}
//       />
//     ));
//   };

//   const handleShare = async (post) => {
//     try {
//       const shareMessage = `Check out this book: "${post.book.title}" shared by ${post.user.name} on BookStore!

// Rating: ${"⭐".repeat(post.book.rating)}
// Description: ${post.book.description}

// #BookStore #BookRecommendation`;

//       const result = await Share.share({
//         message: shareMessage,
//         title: `${post.book.title} - BookStore`,
//       });

//       if (result.action === Share.sharedAction) {
//         if (result.activityType) {
//           console.log("Shared with activity type:", result.activityType);
//         } else {
//           console.log("Book shared successfully");
//         }
//       } else if (result.action === Share.dismissedAction) {
//         console.log("Share dismissed");
//       }
//     } catch (error) {
//       console.error("Error sharing:", error);
//       Alert.alert("Error", "Unable to share this book. Please try again.");
//     }
//   };

//   const BookPost = ({ post, onPress }) => (
//     <TouchableOpacity
//       className="bg-white rounded-2xl mx-4 mb-6 shadow-sm border border-gray-100"
//       onPress={onPress}
//       activeOpacity={0.9}
//     >
//       <View className="flex-row items-center p-4 pb-3">
//         <Image
//           source={{
//             uri:
//               post.user.avatar ||
//               "https://dummyimage.com/100x100/ccc/fff&text=User",
//           }}
//           className="w-10 h-10 rounded-full border-2 border-gray-200"
//           resizeMode="cover"
//           onError={(error) => {
//             console.log("Profile image error:", error);
//           }}
//         />
//         <Text className="text-gray-800 font-semibold text-lg ml-3">
//           {post.user.name}
//         </Text>
//       </View>

//       <View className="px-4 pb-4">
//         <Image
//           source={{ uri: post.book.cover }}
//           className="w-full h-48 rounded-xl"
//           resizeMode="cover"
//           onError={(error) => {
//             console.log("Book cover error:", error);
//           }}
//         />
//       </View>
//       <View className="px-4 pb-4">
//         <Text className="text-xl font-bold text-gray-900 mb-1">
//           {post.book.title}
//         </Text>
//         <View className="flex-row items-center mb-2">
//           {renderStars(post.book.rating)}
//         </View>
//         <Text className="text-gray-600 text-sm mb-2">
//           {post.book.description}
//         </Text>

//         <View className="flex-row items-center justify-between">
//           <Text className="text-gray-400 text-xs">{post.book.date}</Text>
//           <TouchableOpacity
//             className="p-2 -m-2"
//             onPress={() => handleShare(post)}
//             activeOpacity={0.7}
//           >
//             <Ionicons name="share-outline" size={20} color="#6B7280" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       <View className="bg-white px-4 py-4 border-b border-gray-100">
//         <View className="flex-row items-center justify-between">
//           <View className="flex-row items-center">
//             <Text className="text-2xl font-bold text-gray-800">BookStore</Text>
//             <Text className="text-2xl ml-1">�</Text>
//           </View>
//           <TouchableOpacity className="p-2">
//             <Ionicons name="notifications-outline" size={24} color="#374151" />
//           </TouchableOpacity>
//         </View>
//         <Text className="text-sm text-gray-500 mt-1">
//           Discover great reads from the community
//         </Text>
//       </View>

//       <ScrollView
//         className="flex-1"
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={["#6366F1"]}
//           />
//         }
//       >
//         <View className="pt-4">
//           {loading && (
//             <ActivityIndicator size="large" color="#6366F1" className="mt-10" />
//           )}
//           {error && (
//             <Text className="text-center text-red-500 mt-4">{error}</Text>
//           )}
//           {!loading && !error && allBooks?.length === 0 && (
//             <Text className="text-center text-gray-500 mt-4">
//               No books found.
//             </Text>
//           )}
//           {allBooks?.map((book) => (
//             <BookPost
//               key={book._id}
//               post={{
//                 id: book._id,
//                 user: {
//                   name: book.user?.username || "Unknown User",
//                   avatar:
//                     book.user?.profileImage ||
//                     "https://dummyimage.com/100x100/ccc/fff&text=User",
//                 },
//                 book: {
//                   title: book.title,
//                   cover: book.image,
//                   rating: book.rating,
//                   description: book.caption,
//                   date: new Date(book.createdAt).toLocaleDateString(),
//                 },
//               }}
//               onPress={() => router.push({
//                 pathname: '/screens/BookDetails',
//                 params: { bookId: book._id }
//               })}
              
//             />
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Home;

// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   RefreshControl,
//   SafeAreaView,
//   ScrollView,
//   Share,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllBooks } from "../../components/Slice/bookGetSlice";

// const Home = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { user, token } = useSelector((state) => state.auth);
//   const { allBooks, loading, error } = useSelector((state) => state.allbooks);

//   const [refreshing, setRefreshing] = useState(false);

//   const loadBooks = () => {
//     if (token) {
//       dispatch(fetchAllBooks());
//     }
//   };

//   useEffect(() => {
//     loadBooks();
//   }, [token]);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await dispatch(fetchAllBooks());
//     setRefreshing(false);
//   };

//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }, (_, index) => (
//       <Ionicons
//         key={index}
//         name={index < rating ? "star" : "star-outline"}
//         size={16}
//         color={index < rating ? "#FFA500" : "#E5E5E5"}
//       />
//     ));
//   };

//   const handleShare = async (post) => {
//     try {
//       const shareMessage = `Check out this book: "${post.book.title}" shared by ${post.user.name} on BookStore! 
      
// Rating: ${"⭐".repeat(post.book.rating)}
// Description: ${post.book.description}

// #BookStore #BookRecommendation`;

//       const result = await Share.share({
//         message: shareMessage,
//         title: `${post.book.title} - BookStore`,
//       });

//       if (result.action === Share.sharedAction) {
//         if (result.activityType) {
//           console.log("Shared with activity type:", result.activityType);
//         } else {
//           console.log("Book shared successfully");
//         }
//       } else if (result.action === Share.dismissedAction) {
//         console.log("Share dismissed");
//       }
//     } catch (error) {
//       console.error("Error sharing:", error);
//       Alert.alert("Error", "Unable to share this book. Please try again.");
//     }
//   };

//   const BookPost = ({ post }) => (
//     <View className="bg-white rounded-2xl mx-4 mb-6 shadow-sm border border-gray-100">
//       <View className="flex-row items-center p-4 pb-3">
//         <Image
//           source={{
//             uri:
//               post.user.avatar ||
//               "https://dummyimage.com/100x100/ccc/fff&text=User",
//           }}
//           className="w-10 h-10 rounded-full border-2 border-gray-200"
//           resizeMode="cover"
//           onError={(error) => {
//             console.log("Profile image error:", error);
//           }}
//         />
//         <Text className="text-gray-800 font-semibold text-lg ml-3">
//           {post.user.name}
//         </Text>
//       </View>

//       <View className="px-4 pb-4">
//         <Image
//           source={{ uri: post.book.cover }}
//           className="w-full h-48 rounded-xl"
//           resizeMode="cover"
//           onError={(error) => {
//             console.log("Book cover error:", error);
//           }}
//         />
//       </View>
//       <View className="px-4 pb-4">
//         <Text className="text-xl font-bold text-gray-900 mb-1">
//           {post.book.title}
//         </Text>
//         <View className="flex-row items-center mb-2">
//           {renderStars(post.book.rating)}
//         </View>
//         <Text className="text-gray-600 text-sm mb-2">
//           {post.book.description}
//         </Text>

//         <View className="flex-row items-center justify-between">
//           <Text className="text-gray-400 text-xs">{post.book.date}</Text>
//           <TouchableOpacity
//             className="p-2 -m-2"
//             onPress={() => handleShare(post)}
//             activeOpacity={0.7}
//           >
//             <Ionicons name="share-outline" size={20} color="#6B7280" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       <View className="bg-white px-4 py-4 border-b border-gray-100">
//         <View className="flex-row items-center justify-between">
//           <View className="flex-row items-center">
//             <Text className="text-2xl font-bold text-gray-800">BookStore</Text>
//             <Text className="text-2xl ml-1">�</Text>
//           </View>
//           <TouchableOpacity className="p-2">
//             <Ionicons name="notifications-outline" size={24} color="#374151" />
//           </TouchableOpacity>
//         </View>
//         <Text className="text-sm text-gray-500 mt-1">
//           Discover great reads from the community
//         </Text>
//       </View>

//       <ScrollView
//         className="flex-1"
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={["#6366F1"]}
//           />
//         }
//       >
//         <View className="pt-4">
//           {loading && (
//             <ActivityIndicator size="large" color="#6366F1" className="mt-10" />
//           )}
//           {error && (
//             <Text className="text-center text-red-500 mt-4">{error}</Text>
//           )}
//           {!loading && !error && allBooks?.length === 0 && (
//             <Text className="text-center text-gray-500 mt-4">
//               No books found.
//             </Text>
//           )}
//           {allBooks?.map((book) => (
//             <BookPost
//               key={book._id}
//               post={{
//                 id: book._id,
//                 user: {
//                   name: book.user?.username || "Unknown User",
//                   avatar:
//                     book.user?.profileImage ||
//                     "https://dummyimage.com/100x100/ccc/fff&text=User",
//                 },
//                 book: {
//                   title: book.title,
//                   cover: book.image,
//                   rating: book.rating,
//                   description: book.caption,
//                   date: new Date(book.createdAt).toLocaleDateString(),
//                 },
//               }}
//             />
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Home;
