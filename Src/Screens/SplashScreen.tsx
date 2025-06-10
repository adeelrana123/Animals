import React, { useContext, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { AppDataContext } from '../context/AppDataContext';

const SplashScreen = ({ navigation }) => {
  const profile = useSelector(state => state.profile);
  const { appTheme } = useContext(AppDataContext);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (profile?.name) {
        navigation.replace('Home');
      } else {
        navigation.replace('ProfileScreen');
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [profile]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appTheme?.Background || '#fff',
    },
    titles: {
      backgroundColor: appTheme?.Primary || '#000',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 10,
      textAlign: 'center',
      paddingVertical: 15,
    },
  }), [appTheme]);

  return (
    <View style={styles.container}>
      <View style={styles.titles}>
        <Text style={styles.title}>Pak Animals</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('../images/image1.jpg')}
          style={{ width: '100%', height: '100%' }}
        />
      </View>
    </View>
  );
};

export default SplashScreen;
