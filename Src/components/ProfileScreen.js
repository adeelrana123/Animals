import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setProfile } from '../redux/profileSlice';

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const dispatch = useDispatch();

  const saveProfile = async () => {
    if (name && location && phone) {
      const profile = { name, location, phone };

      // 1. Save in AsyncStorage
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      await AsyncStorage.setItem('isProfileCreated', 'true');

      // 2. Save in Redux store
      dispatch(setProfile(profile));

      // 3. Navigate to Home
      navigation.replace('Home');
    } else {
      alert('Please fill all fields.');
    }
  };

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
