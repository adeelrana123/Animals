import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header } from '../components';
import LottieView from 'lottie-react-native';
import loader from '../assets/loader.json'; 
import Entypo from 'react-native-vector-icons/Entypo';
import { AppDataContext } from '../context/AppDataContext';
const UserAdsScreen = ({ route, navigation }) => {
const { ownerId, ownerName, ownerImage } = route.params;
  const item = { ownerId, ownerName, ownerImage };
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true); 
const {appTheme}=useContext(AppDataContext);
  const formatDate = (date: Date) => {
    if (!date) return 'Just now';
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) return 'Just now';
    else if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    else if (diffInHours < 24) return `${diffInHours} hr ago`;
    else if (diffInDays < 30) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    else if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    else return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    setLoading(true); 
    const unsubscribe = firestore()
      .collection('animalListings')
      .where('ownerId', '==', ownerId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          const userAds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setAds(userAds);
          setLoading(false); 
        },
        error => {
          console.error('Error fetching user ads:', error);
          setLoading(false);
        }
      );
    return () => unsubscribe();
  }, [ownerId]);

 const styles = useMemo(()=>{
     return StyleSheet.create({
  container: { flex: 1, backgroundColor:appTheme.Background, },
  list: { padding: 10 },
  card: {
    backgroundColor: '#f9f9f9', borderRadius: 10,
    marginBottom: 15, overflow: 'hidden', padding: 10,
  },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color:appTheme.TextPrimary },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  userProfileSection: { flexDirection: 'row', 
    alignItems: 'center', marginBottom: 8,borderWidth:0.3,
     borderColor:appTheme.TextPrimary, padding: 10, backgroundColor:appTheme.Background,borderRadius:10 },
  profileImage: { width: 60, height: 60, borderRadius: 30 },
  emptyProfileImage: { backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  userInfo: { marginLeft: 30 },
  userName: { fontSize: 18, fontWeight: 'bold', color:appTheme.TextPrimary },
  userDate: { color:appTheme.TextPrimary, fontSize: 13, marginTop: 2 },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:appTheme.Background, 
  },
   containers: {
        width: '100%',
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: appTheme.Primary,
        elevation: 10,
        flexDirection:"row",
        paddingLeft:20,
        // justifyContent:"space-between"
      },
      title: {
        fontSize: 24,
        color:appTheme.white,
        fontWeight: 'bold',
        paddingLeft: 30,
       
      },
});
  },[appTheme])

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detaile', { item })}
    >
      <View style={styles.userProfileSection}>
        {item.ownerImage ? (
          <Image source={{ uri: item.ownerImage }} style={styles.profileImage} resizeMode="cover" />
        ) : (
          <View style={[styles.profileImage, styles.emptyProfileImage]}>
            <Icon name="person" size={50} color="#777" />
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.ownerName || 'Unknown'}</Text>
          {item.createdAt && <Text style={styles.userDate}>{formatDate(item.createdAt.toDate())}</Text>}
        </View>
      </View>

      {item.images?.length > 0 && (
        <Image source={{ uri: item.images[0] }} style={styles.image} />
      )}
    </TouchableOpacity>
  );
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <LottieView source={loader} autoPlay loop style={{ width: 150, height: 150 }} />
      </View>
    );
  }
  

  return (
    <View style={styles.container}>
 <View style={[styles.containers, { height: "10%" }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Entypo name="chevron-thin-left" size={26}  style={{marginRight:20,color:appTheme.white,}} />
        </TouchableOpacity>
      {item.ownerImage ? (
          <Image source={{ uri: item.ownerImage }} style={styles.profileImage} resizeMode="cover" />
        ) : (
          <View style={[styles.profileImage, styles.emptyProfileImage]}>
            <Icon name="person" size={50} color="#777" />
          </View>
        )}
      <Text style={styles.title}>{item.ownerName || 'Unknown'}</Text>
    </View>

       {ads.length > 0 ? (
        <FlatList
          data={ads}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No ads found for this user</Text>
        </View>
      )}
    </View>
  );
};



export default UserAdsScreen;
