import { Image, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import React, { useContext, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppDataContext } from '../context/AppDataContext';


const ProfileScreen = () => {
    const {appTheme}=useContext(AppDataContext);
  const navigation = useNavigation();
  const profile = useSelector((state: RootState) => state.profile);
  
  // Debugging logs
  console.log('Profile data:', profile);
  console.log('Image URI:', profile.image);

  // Check if profile exists and has data
  const hasProfileData = profile.name || profile.phone || profile.location || profile.image;
const styles = useMemo(()=>{
    return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:appTheme.Background,
  },
  containers: {
     backgroundColor:appTheme.Primary,
  },
  topcontainer:{ padding:20}, 
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
     marginBottom:10,
    textAlign: 'center',
    paddingVertical:15
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color:appTheme.TextPrimary,
  },
  detailsContainer: {
    marginBottom: 30,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 100,
    fontSize: 16,
   color:appTheme.TextPrimary,
  },
  detailValue: {
    fontSize: 16,
    color:appTheme.TextPrimary,
    flex: 1,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyProfile: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
   color:appTheme.TextPrimary,
  },
  createButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  defaultImageContainer: {
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#ddd',
},
userProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  emptyProfileImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
});
  },[appTheme])
  return (
    <View style={styles.container}>
      <View style={styles.containers}>
        <Text style={styles.heading}> My Profile</Text>
      </View>
      <View style={styles.topcontainer}>
      {hasProfileData ? (
        <>
          <View style={styles.profileHeader}>
            {profile.image ? (
              <Image
                source={{ uri: profile.image }}
                style={styles.profileImage}
                resizeMode="cover"
                onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
              />
            ) : (
              <View style={[styles.profileImage, styles.emptyProfileImage]}>
                          <Icon name="person" size={80} color="#777" />
                        </View>
            )}
            {profile.name && <Text style={styles.profileName}>{profile.name}</Text>}
          </View>

          <View style={styles.detailsContainer}>
            {profile.phone && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{profile.phone}</Text>
              </View>
            )}

            {profile.location && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Address:</Text>
                <Text style={styles.detailValue}>{profile.location}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={styles.editButton}
            onPress={() =>  navigation.navigate('CreateProfile', { 
  profileData: {
    name: profile.name,
    phone: profile.phone,
    location: profile.location,
   image: 'uri-to-image'
   
  }
})}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.emptyProfile}>
          <Text style={styles.emptyText}>No profile created yet</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateProfile')}
          >
            <Text style={styles.createButtonText}>Create Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
    </View>
  );
};

// ... (keep your existing styles)



export default ProfileScreen;