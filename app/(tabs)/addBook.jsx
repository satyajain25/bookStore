import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { addBookToList } from '../../components/Slice/bookGetSlice';
import { submitBook } from '../../components/Slice/bookSlice';
import { addBookToUser } from '../../components/Slice/userSlice';
import { getUserData } from '../../utils/storage';

const AddBook = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [rating, setRating] = useState(3);
  const [imageUri, setImageUri] = useState('');
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    const loadUserAndToken = async () => {
      const storedUser = await getUserData();
      const storedToken = await AsyncStorage.getItem('token');
      if (storedUser?._id) {
        setUserId(storedUser._id);
      } else {
        Alert.alert('Error', 'User not found. Please log in again.');
      }
      if (storedToken) {
        setToken(storedToken);
      }
    };
    loadUserAndToken();
  }, []);

  const handleImagePick = async (useCamera) => {
    const { status } = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Denied', `We need access to your ${useCamera ? 'camera' : 'photo library'}.`);
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 1,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });

    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => handleImagePick(true) },
        { text: 'Gallery', onPress: () => handleImagePick(false) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleSubmit = async () => {
    if (!title || !caption || !imageUri || !rating || !userId || !token) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);

    const bookData = {
      title,
      caption,
      image: imageUri,
      rating,
      user: userId,
      token,
    };

    try {
      const action = await dispatch(submitBook(bookData));

      if (submitBook.fulfilled.match(action)) {
        const newBook = {
          ...action.payload,
          user: {
            username: user?.username || 'You',
            profileImage: user?.profileImage || null,
          },
        };

        dispatch(addBookToList(newBook));
        dispatch(addBookToUser(newBook));

        Alert.alert('Success', 'Book submitted!');
        setTitle('');
        setCaption('');
        setImageUri('');
        setRating(3);
        router.push('/(tabs)');
      } else {
        Alert.alert('Error', action.payload || 'Book submission failed.');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 20, paddingTop: 30 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#047857', marginBottom: 4 }}>
            📚 Add Book Recommendation
          </Text>
          <Text style={{ textAlign: 'center', color: '#6b7280', marginBottom: 20 }}>
            Share your favorite reads with others
          </Text>

          {/* Title Input */}
          <Text style={{ fontSize: 16, fontWeight: '500', color: '#1f2937', marginBottom: 4 }}>Book Title</Text>
          <TextInput
            placeholder="Enter book title"
            value={title}
            onChangeText={setTitle}
            style={{
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: '#fff',
              fontSize: 16,
              marginBottom: 20,
            }}
            placeholderTextColor="#9ca3af"
          />

          {/* Rating */}
          <Text style={{ fontSize: 16, fontWeight: '500', color: '#1f2937', marginBottom: 8 }}>Your Rating</Text>
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => setRating(i)} style={{ marginRight: 8 }}>
                <Icon
                  name="star"
                  size={30}
                  color={i <= rating ? '#facc15' : '#d1d5db'}
                  style={{ shadowColor: '#facc15', shadowRadius: i <= rating ? 3 : 0 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Image Upload */}
          <Text style={{ fontSize: 16, fontWeight: '500', color: '#1f2937', marginBottom: 8 }}>Book Image</Text>
          <TouchableOpacity
            onPress={showImagePickerOptions}
            style={{
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: '#34d399',
              backgroundColor: '#fff',
              borderRadius: 12,
              height: 190,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
              overflow: 'hidden',
            }}
          >
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{ width: '100%', height: '100%', borderRadius: 12 }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Icon name="image" size={34} color="#9ca3af" />
                <Text style={{ color: '#9ca3af', marginTop: 8 }}>Tap to select image</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Caption */}
          <Text style={{ fontSize: 16, fontWeight: '500', color: '#1f2937', marginBottom: 4 }}>Caption</Text>
          <TextInput
            placeholder="Write your review or thoughts about this book..."
            value={caption}
            onChangeText={setCaption}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            style={{
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: '#fff',
              fontSize: 16,
              marginBottom: 24,
            }}
            placeholderTextColor="#9ca3af"
          />

          {/* Submit Button with Loader */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#6ee7b7' : '#059669',
              paddingVertical: 16,
              borderRadius: 12,
              marginBottom: 40,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 18 }}>
                Submit Recommendation
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default AddBook;

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as ImagePicker from 'expo-image-picker';
// import { useRouter } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import {
//   Alert,
//   Image,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
//   ActivityIndicator,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { useDispatch, useSelector } from 'react-redux';
// import { addBookToList } from '../../components/Slice/bookGetSlice';
// import { submitBook } from '../../components/Slice/bookSlice';
// import { addBookToUser } from '../../components/Slice/userSlice';
// import { getUserData } from '../../utils/storage';

// const AddBook = () => {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const [userId, setUserId] = useState(null);
//   const [token, setToken] = useState(null);
//   const [title, setTitle] = useState('');
//   const [caption, setCaption] = useState('');
//   const [rating, setRating] = useState(3);
//   const [imageUri, setImageUri] = useState('');
//   const [loading, setLoading] = useState(false); // ✅ Loader state

//   const user = useSelector((state) => state.auth?.user);

//   useEffect(() => {
//     const loadUserAndToken = async () => {
//       const storedUser = await getUserData();
//       const storedToken = await AsyncStorage.getItem('token');
//       if (storedUser?._id) {
//         setUserId(storedUser._id);
//       } else {
//         Alert.alert('Error', 'User not found. Please log in again.');
//       }
//       if (storedToken) {
//         setToken(storedToken);
//       }
//     };
//     loadUserAndToken();
//   }, []);

//   const handleImagePick = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Denied', 'We need access to your photo library.');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled && result.assets?.length > 0) {
//       setImageUri(result.assets[0].uri);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!title || !caption || !imageUri || !rating || !userId || !token) {
//       Alert.alert('Validation Error', 'Please fill in all fields.');
//       return;
//     }

//     setLoading(true); // ✅ Show loader

//     const bookData = {
//       title,
//       caption,
//       image: imageUri,
//       rating,
//       user: userId,
//       token,
//     };

//     try {
//       const action = await dispatch(submitBook(bookData));

//       if (submitBook.fulfilled.match(action)) {
//         const newBook = {
//           ...action.payload,
//           user: {
//             username: user?.username || 'You',
//             profileImage: user?.profileImage || null,
//           },
//         };

//         dispatch(addBookToList(newBook));
//         dispatch(addBookToUser(newBook));

//         Alert.alert('Success', 'Book submitted!');
//         setTitle('');
//         setCaption('');
//         setImageUri('');
//         setRating(3);
//         router.push('/(tabs)');
//       } else {
//         Alert.alert('Error', action.payload || 'Book submission failed.');
//       }
//     } catch (err) {
//       Alert.alert('Error', err.message || 'Something went wrong.');
//     } finally {
//       setLoading(false); // ✅ Hide loader
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//       >
//         <ScrollView
//           style={{ flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 20, paddingTop: 30 }}
//           contentContainerStyle={{ paddingBottom: 40 }}
//           keyboardShouldPersistTaps="handled"
//         >
//           <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#047857', marginBottom: 4 }}>
//             📚 Add Book Recommendation
//           </Text>
//           <Text style={{ textAlign: 'center', color: '#6b7280', marginBottom: 20 }}>
//             Share your favorite reads with others
//           </Text>

//           {/* Title Input */}
//           <Text style={{ fontSize: 16, fontWeight: '500', color: '#1f2937', marginBottom: 4 }}>Book Title</Text>
//           <TextInput
//             placeholder="Enter book title"
//             value={title}
//             onChangeText={setTitle}
//             style={{
//               borderWidth: 1,
//               borderColor: '#d1d5db',
//               borderRadius: 12,
//               paddingHorizontal: 16,
//               paddingVertical: 12,
//               backgroundColor: '#fff',
//               fontSize: 16,
//               marginBottom: 20,
//             }}
//             placeholderTextColor="#9ca3af"
//           />

//           {/* Rating */}
//           <Text style={{ fontSize: 16, fontWeight: '500', color: '#1f2937', marginBottom: 8 }}>Your Rating</Text>
//           <View style={{ flexDirection: 'row', marginBottom: 20 }}>
//             {[1, 2, 3, 4, 5].map((i) => (
//               <TouchableOpacity key={i} onPress={() => setRating(i)} style={{ marginRight: 8 }}>
//                 <Icon
//                   name="star"
//                   size={30}
//                   color={i <= rating ? '#facc15' : '#d1d5db'}
//                   style={{ shadowColor: '#facc15', shadowRadius: i <= rating ? 3 : 0 }}
//                 />
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Image Upload */}
//           <Text style={{ fontSize: 16, fontWeight: '500', color: '#1f2937', marginBottom: 8 }}>Book Image</Text>
//           <TouchableOpacity
//             onPress={handleImagePick}
//             style={{
//               borderWidth: 2,
//               borderStyle: 'dashed',
//               borderColor: '#34d399',
//               backgroundColor: '#fff',
//               borderRadius: 12,
//               height: 190,
//               justifyContent: 'center',
//               alignItems: 'center',
//               marginBottom: 20,
//               overflow: 'hidden',
//             }}
//           >
//             {imageUri ? (
//               <Image
//                 source={{ uri: imageUri }}
//                 style={{ width: '100%', height: '100%', borderRadius: 12 }}
//                 resizeMode="cover"
//               />
//             ) : (
//               <View style={{ alignItems: 'center' }}>
//                 <Icon name="image" size={34} color="#9ca3af" />
//                 <Text style={{ color: '#9ca3af', marginTop: 8 }}>Tap to select image</Text>
//               </View>
//             )}
//           </TouchableOpacity>

//           {/* Caption */}
//           <Text style={{ fontSize: 16, fontWeight: '500', color: '#1f2937', marginBottom: 4 }}>Caption</Text>
//           <TextInput
//             placeholder="Write your review or thoughts about this book..."
//             value={caption}
//             onChangeText={setCaption}
//             multiline
//             numberOfLines={5}
//             textAlignVertical="top"
//             style={{
//               borderWidth: 1,
//               borderColor: '#d1d5db',
//               borderRadius: 12,
//               paddingHorizontal: 16,
//               paddingVertical: 12,
//               backgroundColor: '#fff',
//               fontSize: 16,
//               marginBottom: 24,
//             }}
//             placeholderTextColor="#9ca3af"
//           />

//           {/* Submit Button with Loader */}
//           <TouchableOpacity
//             onPress={handleSubmit}
//             disabled={loading}
//             style={{
//               backgroundColor: loading ? '#6ee7b7' : '#059669',
//               paddingVertical: 16,
//               borderRadius: 12,
//               marginBottom: 40,
//               flexDirection: 'row',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 18 }}>
//                 Submit Recommendation
//               </Text>
//             )}
//           </TouchableOpacity>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </TouchableWithoutFeedback>
//   );
// };

// export default AddBook;
