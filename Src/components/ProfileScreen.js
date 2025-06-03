import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setProfile } from '../redux/profileSlice';
import uuid from 'react-native-uuid';

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const dispatch = useDispatch();

  const getOrCreateUserId = async () => {
    let userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      userId = uuid.v4();
      await AsyncStorage.setItem('userId', userId);
    }
    return userId;
  };

  const saveProfile = async () => {
     if (name && location && phone) {
    const userId = await getOrCreateUserId();  
      // Alert.alert('Generated User ID', userId);
    const profile = { id: userId, name, location, phone };

      try {
        await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
        await AsyncStorage.setItem('isProfileCreated', 'true');
        dispatch(setProfile(profile));
        navigation.replace('Home');
      } catch (error) {
        Alert.alert('Error', 'Failed to save profile');
      }
    } else {
      alert('Please fill all fields.');
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
      />

      <Text style={styles.label}>Address (City)</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter your location"
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="Enter phone number"
      />

      <Button title="Save Profile" onPress={saveProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginBottom: 5, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
