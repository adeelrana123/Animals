import React, { useContext, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux'
import { setProfile } from '../redux';
import { AppDataContext } from '../context/AppDataContext';
import { useNavigation } from '@react-navigation/native';

const Sell = () => {
  const navigation = useNavigation();
    const {appTheme}=useContext(AppDataContext);
 const [images, setImages] = useState(Array(4).fill(null)); 
  const dispatch = useDispatch();
  const profile = useSelector(state => state.profile);
  const { name, phone: phoneNumber, location } = profile;
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
   const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
  { label: 'Cow', value: 'Cow' },
  { label: 'Buffalo', value: 'Buffalo' },
  { label: 'Goat', value: 'Goat' },
  { label: 'Sheep', value: 'Sheep' },
  { label: 'Camel', value: 'Camel' },
  { label: 'Horse', value: 'Horse' },
  { label: 'Donkey', value: 'Donkey' },
  { label: 'Dog', value: 'Dog' },
  { label: 'Cat', value: 'Cat' },
  { label: 'Rabbit', value: 'Rabbit' },
  { label: 'Chicken', value: 'Chicken' },
  { label: 'Duck', value: 'Duck' },
  { label: 'Turkey', value: 'Turkey' },
  { label: 'Pigeon', value: 'Pigeon' },
  { label: 'Parrot', value: 'Parrot' },
  { label: 'Fish', value: 'Fish' },
  { label: 'Peacock', value: 'Peacock' },
  { label: 'Ostrich', value: 'Ostrich' },
  { label: 'Deer', value: 'Deer' },
  { label: 'Other', value: 'Other' },
]);
const pickImage = async (index:any) => {
  const options = {
    mediaType: 'photo',
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 2000,
  };

  const result = await launchImageLibrary(options);
  if (!result.didCancel && !result.error && result.assets) {
    const newImages = [...images];
    newImages[index] = result.assets[0].uri;
    setImages(newImages);
  }
};
const uploadImageToCloudinary = async (imageUri:any) => {
  const data = new FormData();
  data.append('file', {
    uri: imageUri.startsWith('file://') ? imageUri : `file://${imageUri}`,
    type: 'image/jpeg',
    name: 'upload.jpg',
  });
  data.append('upload_preset', 'images'); 

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
const handleSubmit = async () => {
  try {
    const selectedImages = images.filter(img => img !== null);

    if (selectedImages.length === 0) {
      Alert.alert('Error', 'Please add at least one image');
      return;
    }
     if (!value) {
    Alert.alert('Error', 'Please select a category');
    return;
  }
  if (!gender) {
    Alert.alert('Error', 'Please select gender');
    return;
  }
    const uploadedImageUrls = [];
    for (let i = 0; i < selectedImages.length; i++) {
      const url = await uploadImageToCloudinary(selectedImages[i]);
      if (url) {
        uploadedImageUrls.push(url);
      }
    }
    if (uploadedImageUrls.length === 0) {
      Alert.alert('Error', 'Failed to upload images');
      return;
    }
    
  


 await firestore().collection('animalListings').add({
      images: uploadedImageUrls,
      category: value,
      gender,
      age,
      weight,
      price,
      name,
      location,
      phoneNumber,
      message,
      createdAt: firestore.FieldValue.serverTimestamp(),
      ownerName: profile.name || 'No Name',
      // ownerId: profile.phone || 'No ID',
      ownerId: profile.id || 'No ID',
      ownerImage: profile.image || '', 
      // ownerId: profile.id,
       likes: 0,
  dislikes: 0,
  likedUsers: [],
  dislikedUsers: [],
  reactions: {},
  
      
   
    });

    setImages([null, null, null, null]);
    setValue(null);
    setOpen(false);
    setGender('');
    setAge('');
    setWeight('');
    setPrice('');
    setMessage('');

    Alert.alert('Success', 'Your post has been submitted!');
     navigation.navigate('Home');
  } catch (error) {
    console.error('Error submitting listing:', error);
    Alert.alert('Error', 'Failed to submit post. Please try again.');
  }
};
  const onNameChange = (text:any) => {
    dispatch(setProfile({ name: text }));
  };
  
  const onLocationChange = (text:any) => {
    dispatch(setProfile({ location: text }));
  };
  
  const onPhoneChange = (text:any) => {
    dispatch(setProfile({ phone: text }));
  };
  const styles = useMemo(()=>{
    return StyleSheet.create({
  topcontainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
   padding:20
  },
  containers: {
     backgroundColor:appTheme.Primary,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
     marginBottom:10,
    textAlign: 'center',
    paddingVertical:15
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  imageButton: {
    width: '48%',
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    color: '#888',
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#444',
  },
  mediaButton: {
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  mediaPlaceholder: {
    color: '#888',
  },
  label: {
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  radioButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  radioSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 1,
    marginHorizontal:20
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  removeButton: {
  position: 'absolute',
  top: 5,
  right: 5,
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: 15,
  width: 30,
  height: 30,
  justifyContent: 'center',
  alignItems: 'center',
},
removeButtonText: {
  color: 'white',
  fontSize: 20,
  lineHeight: 30,
},
});
  },[appTheme])
  return (
    <View style={styles.topcontainer}> 
    <View style={styles.containers}> 
  <Text style={styles.heading}>Sell Animal</Text>
   </View>

    <ScrollView style={styles.container}>

<Text style={styles.sectionTitle}>Add Pictures (1-4)</Text>
<View style={styles.imagesContainer}>
  {Array.isArray(images) && images.length === 4 && images.map((img, index) => (
    <TouchableOpacity 
      key={index}
      style={styles.imageButton}
      onPress={() => pickImage(index)}
    >
      {img ? (
        <>
          <Image source={{ uri: img }} style={styles.imagePreview} />
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={(e) => {
              e.stopPropagation();
              const newImages = [...images];
              newImages[index] = null;
              setImages(newImages);
            }}
          >
            <Text style={styles.removeButtonText}>×</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.imagePlaceholder}>+ Add</Text>
      )}
    </TouchableOpacity>
  ))}
</View>
      <Text style={styles.sectionTitle}>Ads Details</Text>
<Text style={styles.label}>Category</Text>
<View style={{ marginBottom: open ? 220 : 20 }}>
  <DropDownPicker
    open={open}
    value={value}
    items={items}
    setOpen={setOpen}
    setValue={setValue}
    setItems={setItems}
    placeholder="Select Animal Category"
    style={styles.dropdown}
    dropDownContainerStyle={[
      styles.dropdownContainer,
      { maxHeight: 200 }
    ]}
    listMode="SCROLLVIEW"
    scrollViewProps={{
      nestedScrollEnabled: true,
    }}
    zIndex={1000}
    zIndexInverse={1000}
  />
</View>
      <Text style={styles.label}>Gender</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity 
          style={[styles.radioButton, gender === 'Male' && styles.radioSelected]}
          onPress={() => setGender('Male')}
        >
          <Text>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.radioButton, gender === 'Female' && styles.radioSelected]}
          onPress={() => setGender('Female')}
        >
          <Text>Female</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Age (years)</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        placeholder="Enter age"
      />

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        placeholder="Enter weight"
      />

      <Text style={styles.label}>Price (PKR)</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder="Enter price"
      />
      <Text style={styles.label}>Message</Text>
      <TextInput
        style={[styles.input, styles.messageInput]}
        value={message}
        onChangeText={setMessage}
        placeholder="Add any additional information"
        multiline
        numberOfLines={4}
      />
      <Text style={styles.sectionTitle}>Contact Information</Text>
      
     <Text style={styles.label}>Your Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={onNameChange}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Address (City)</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={onLocationChange}
        placeholder="Enter your location"
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={[styles.input,{marginBottom:30}]}
        value={phoneNumber}
        onChangeText={onPhoneChange}
        keyboardType="phone-pad"
        placeholder="Enter phone number"
      />
 </ScrollView>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit </Text>
      </TouchableOpacity>
    </View>
  );
};
export default Sell;