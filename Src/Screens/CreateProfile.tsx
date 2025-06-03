import React, { useState } from 'react';
import { View, TextInput, Button, Image, Alert, Text, TouchableOpacity,StyleSheet, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { setProfile } from '../redux/profileSlice'; // apne path ke hisaab se adjust karein
import { Header } from '../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import getOrCreateUserId from '../untils/getOrCreateUserId';
const CreateProfile = ({ route }) => {
  const navigation = useNavigation();
  const { profileData } = route.params || {};
  const existingProfile = useSelector(state => state.profile);
  const dispatch = useDispatch();

  const [name, setName] = useState(profileData?.name || existingProfile?.name || '');
  const [phone, setPhone] = useState(profileData?.phone || existingProfile?.phone || '');
  const [location, setLocation] = useState(profileData?.location || existingProfile?.location || '');
  const [image, setImage] = useState(profileData?.image || existingProfile?.image || null);
  const [isEditing, setIsEditing] = useState(!!profileData || !!existingProfile?.name);
  const [imageChanged, setImageChanged] = useState(false);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    const result = await launchImageLibrary(options);
    if (!result.didCancel && !result.error && result.assets?.length > 0) {
      const selectedUri = result.assets[0].uri;
      setImage(selectedUri);
      setImageChanged(true);
    }
  };

  const uploadImageToCloudinary = async (imageUri:any) => {
  const data = new FormData();
  data.append('file', {
    uri: imageUri.startsWith('file://') ? imageUri : `file://${imageUri}`,
    type: 'image/jpeg',
    name: 'upload.jpg',
  });
  data.append('upload_preset', 'images'); // use your unsigned preset name exactly

  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/dzj9qza60/image/upload', {
      method: 'POST',
      body: data,
    });
    const result = await res.json();
    if (result.secure_url) {
      console.log('Uploaded Image URL:', result.secure_url);
      return result.secure_url;
    } else {
      console.error('Cloudinary error:', result);
      return null;
    }
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
};

 const saveProfileToFirestore = async (userId, profile) => {
  try {
    await firestore()
      .collection('profiles')
      .doc(userId) // ✅ Save using userId
      .set(profile);
    console.log('Profile saved to Firestore');
  } catch (error) {
    console.log('Firestore save error:', error);
  }
};


 const handleSaveProfile = async () => {
  if (!name || !phone || !location) {
    Alert.alert('Error', 'Please fill all required fields');
    return;
  }

  setUploading(true); 

  let imageUrl = existingProfile?.image || null;

  if (imageChanged && image) {
    const uploadedUrl = await uploadImageToCloudinary(image);
    if (uploadedUrl) {
      imageUrl = uploadedUrl;
    } else {
      setUploading(false);
      Alert.alert('Upload Failed', 'Failed to upload the image. Please try again.');
      return; // Stop saving if upload fails
    }
  }
const userId = await getOrCreateUserId(); 
    const profile = {
      name,
       id: userId, // ✅ Save it in profile object
      phone,
      location,
      image: imageUrl,
      createdAt: existingProfile?.createdAt || new Date().toISOString(),
      isAdmin: existingProfile?.isAdmin || false, // Default to false if not set
      
    };

    dispatch(setProfile(profile));
    await saveProfileToFirestore(userId, profile); // ✅ Pass it

    Alert.alert('Success', isEditing ? 'Profile updated successfully!' : 'Profile saved successfully!');
    navigation.goBack();
  };


  return (
    <View style={styles.container}>
      <Header title={isEditing ? 'Edit Profile' : 'Create Profile'} />
      
    
<ScrollView contentContainerStyle={styles.content}>
       <View style={styles.imageWrapper}>
 <TouchableOpacity onPress={pickImage}>
  {(imageChanged && image) ? (
    <Image source={{ uri: image }} style={styles.profileImage} />
  ) : existingProfile?.image ? (
    <Image source={{ uri: existingProfile.image }} style={styles.profileImage} />
  ) : (
    <View style={styles.imagePlaceholder}>
      <Text style={styles.placeholderText}>+ Add Photo</Text>
    </View>
  )}
  <View style={styles.editIcon}>
    <Ionicons name="camera" size={24} color="#fff" />
  </View>
</TouchableOpacity>

</View>

 
        {/* Form Fields */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your Name"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="03001234567"
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Lahore, Pakistan"
        />
 </ScrollView>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSaveProfile}
        >
          <Text style={styles.buttonText}>
            {isEditing ? 'Update Profile' : 'Save Profile'}
          </Text>
        </TouchableOpacity>
      </View>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  placeholderText: {
    color: '#888',
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    // marginTop: 20,
    marginHorizontal:20,
    marginBottom:20
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
   editIcon: {
    position: 'absolute',
    bottom: 30,
    right: -6,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 8,
  },
  imageWrapper: {
  alignSelf: 'center',
  marginBottom: 30,
  position: 'relative',
},
});

export default CreateProfile;