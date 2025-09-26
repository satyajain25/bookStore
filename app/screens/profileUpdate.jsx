import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../components/Slice/authSlice';

const ProfileUpdate = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUser = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({ name: '', email: '' });
  const [imageUri, setImageUri] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.username || '',
        email: currentUser.email || '',
      });
      if (currentUser.profileImage) {
        setImageUri(currentUser.profileImage);
      }
    }
  }, [currentUser]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async (useCamera) => {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission denied', `We need access to your ${useCamera ? 'camera' : 'gallery'}.`);
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 0.7,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
          allowsEditing: true,
        });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => pickImage(true) },
        { text: 'Gallery', onPress: () => pickImage(false) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleUpdateProfile = async () => {
    if (!validateForm()) return;

    try {
      setUploading(true);

      const payload = {
        name: formData.name,
        email: formData.email,
        image: imageUri && !imageUri.startsWith('http')
          ? {
              uri: imageUri,
              fileName: imageUri.split('/').pop(),
              type: `image/${(imageUri.split('.').pop() || 'jpg')}`,
            }
          : null,
      };

      const resultAction = await dispatch(updateUser(payload));
      setUploading(false);

      if (updateUser.fulfilled.match(resultAction)) {
        Alert.alert('Success', 'Profile updated successfully!');
        router.push('/profile');
      } else {
        Alert.alert('Error', resultAction.payload || 'Update failed');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      setUploading(false);
      Alert.alert('Error', 'Something went wrong!');
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-12 pb-8">
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-gray-800 mb-2">Update Profile</Text>
          <Text className="text-gray-600 text-center">Update your personal information</Text>
        </View>

        {/* Profile Image */}
        <View className="items-center mb-8">
          <TouchableOpacity onPress={showImagePickerOptions}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                className="w-24 h-24 rounded-full border-4 border-[#059669]"
              />
            ) : (
              <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center border-4 border-[#059669]">
                <Text className="text-4xl">👤</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text className="text-gray-600 text-sm mt-2">Tap to change photo</Text>
        </View>

        {/* Name Input */}
        <View>
          <Text className="text-gray-700 font-semibold mb-2 text-base">Full Name</Text>
          <TextInput
            className={`bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-4 text-gray-800 text-base`}
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
          {errors.name && <Text className="text-red-500 text-sm mt-1 ml-2">{errors.name}</Text>}
        </View>

        {/* Email Input */}
        <View className="mt-6">
          <Text className="text-gray-700 font-semibold mb-2 text-base">Email Address</Text>
          <TextInput
            className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-4 text-gray-800 text-base`}
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text className="text-red-500 text-sm mt-1 ml-2">{errors.email}</Text>}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-[#059669] rounded-xl py-4 mt-8 shadow-lg"
          onPress={handleUpdateProfile}
          activeOpacity={0.8}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">Update Profile</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileUpdate;

// import * as ImagePicker from 'expo-image-picker';
// import { useRouter } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { updateUser } from '../../components/Slice/authSlice';

// const ProfileUpdate = () => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const currentUser = useSelector((state) => state.auth.user);

//   const [formData, setFormData] = useState({ name: '', email: '' });
//   const [imageUri, setImageUri] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     if (currentUser) {
//       setFormData({
//         name: currentUser.username || '',
//         email: currentUser.email || '',
//       });
//       if (currentUser.profileImage) {
//         setImageUri(currentUser.profileImage);
//       }
//     }
//   }, [currentUser]);

//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: '' }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!validateEmail(formData.email)) {
//       newErrors.email = 'Invalid email';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const pickImage = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) {
//       Alert.alert('Permission denied', 'We need access to your gallery.');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.7,
//       allowsEditing: true,
//     });

//     if (!result.canceled) {
//       setImageUri(result.assets[0].uri);
//     }
//   };

//   const handleUpdateProfile = async () => {
//     if (!validateForm()) return;

//     try {
//       setUploading(true);

//       const payload = {
//         name: formData.name,
//         email: formData.email,
//         image: imageUri && !imageUri.startsWith('http')
//           ? {
//               uri: imageUri,
//               fileName: imageUri.split('/').pop(),
//               type: `image/${(imageUri.split('.').pop() || 'jpg')}`,
//             }
//           : null,
//       };

//       const resultAction = await dispatch(updateUser(payload));
//       setUploading(false);

//       if (updateUser.fulfilled.match(resultAction)) {
//         Alert.alert('Success', 'Profile updated successfully!');
//         router.push('/profile');
//       } else {
//         Alert.alert('Error', resultAction.payload || 'Update failed');
//       }
//     } catch (err) {
//       console.error('Upload Error:', err);
//       setUploading(false);
//       Alert.alert('Error', 'Something went wrong!');
//     }
//   };

//   return (
//     <ScrollView className="flex-1 bg-white">
//       <View className="px-6 pt-12 pb-8">
//         <View className="items-center mb-8">
//           <Text className="text-2xl font-bold text-gray-800 mb-2">Update Profile</Text>
//           <Text className="text-gray-600 text-center">Update your personal information</Text>
//         </View>

//         {/* Profile Image */}
//         <View className="items-center mb-8">
//           <TouchableOpacity onPress={pickImage}>
//             {imageUri ? (
//               <Image
//                 source={{ uri: imageUri }}
//                 className="w-24 h-24 rounded-full border-4 border-[#059669]"
//               />
//             ) : (
//               <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center border-4 border-[#059669]">
//                 <Text className="text-4xl">👤</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//           <Text className="text-gray-600 text-sm mt-2">Tap to change photo</Text>
//         </View>

//         {/* Name Input */}
//         <View>
//           <Text className="text-gray-700 font-semibold mb-2 text-base">Full Name</Text>
//           <TextInput
//             className={`bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-4 text-gray-800 text-base`}
//             placeholder="Enter your full name"
//             value={formData.name}
//             onChangeText={(text) => handleInputChange('name', text)}
//           />
//           {errors.name && <Text className="text-red-500 text-sm mt-1 ml-2">{errors.name}</Text>}
//         </View>

     
//         <View className="mt-6">
//           <Text className="text-gray-700 font-semibold mb-2 text-base">Email Address</Text>
//           <TextInput
//             className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-4 text-gray-800 text-base`}
//             placeholder="Enter your email"
//             value={formData.email}
//             onChangeText={(text) => handleInputChange('email', text)}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />
//           {errors.email && <Text className="text-red-500 text-sm mt-1 ml-2">{errors.email}</Text>}
//         </View>

//         {/* Submit Button */}
//         <TouchableOpacity
//           className="bg-[#059669] rounded-xl py-4 mt-8 shadow-lg"
//           onPress={handleUpdateProfile}
//           activeOpacity={0.8}
//           disabled={uploading}
//         >
//           {uploading ? (
//             <ActivityIndicator size="small" color="white" />
//           ) : (
//             <Text className="text-white text-center font-semibold text-lg">Update Profile</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// export default ProfileUpdate;
