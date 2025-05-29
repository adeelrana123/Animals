import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';

const SplashScreen = ({ navigation }) => {
  const profile = useSelector(state => state.profile);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (profile.name) {
        navigation.replace('Home');
      } else {
        navigation.replace('ProfileScreen');
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [profile]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Pakistan Animals</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

export default SplashScreen;
