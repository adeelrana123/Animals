import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setProfile } from '../redux/profileSlice';
import uuid from 'react-native-uuid';
import { AppDataContext } from '../context/AppDataContext';

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const dispatch = useDispatch();
 const { appTheme } = useContext(AppDataContext);
  const getOrCreateUserId = async () => {
    let userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      userId = uuid.v4();
      await AsyncStorage.setItem('userId', userId);
    }
    return userId;
  };
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor:appTheme.Background, },
  label: { marginBottom: 5,
     fontWeight: 'bold',
     color: appTheme.TextPrimary, },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,

  },
});
 const saveProfile = async () => {
  const phoneRegex = /^03[0-9]{9}$/;         
  const nameRegex = /^[A-Za-z ]+$/;         

  if (!name || !location || !phone) {
    Alert.alert('Missing Fields', 'Please fill all fields.');
    return;
  }

  if (!nameRegex.test(name)) {
    Alert.alert('Invalid Name', 'Name should only contain letters and spaces.');
    return;
  }

  if (!phoneRegex.test(phone)) {
    Alert.alert('Invalid Phone Number', 'Please enter a valid 11-digit phone number starting with 03.');
    return;
  }

  const userId = await getOrCreateUserId();
  const profile = { id: userId, name, location, phone };

  try {
    await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
    await AsyncStorage.setItem('isProfileCreated', 'true');
    dispatch(setProfile(profile));
    navigation.replace('Home');
  } catch (error) {
    Alert.alert('Error', 'Failed to save profile');
  }
};

  useEffect(() => {
  const showId = async () => {
    const userId = await AsyncStorage.getItem('userId');
    console.log('Stored ID:', userId);
  };
  showId();
}, []);



  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor={appTheme.TextPrimary}
      />

      <Text style={styles.label}>Address (City)</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter your address (city)"
         placeholderTextColor={appTheme.TextPrimary}
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="Enter phone number"
         placeholderTextColor={appTheme.TextPrimary}
      />

      <Button title="Save Profile" onPress={saveProfile} />
    </View>
  );
}

