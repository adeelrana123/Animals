import { StyleSheet, Text, TouchableOpacity, View, Image, FlatList, Alert, ScrollView, Modal } from 'react-native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppDataContext } from '../context/AppDataContext';

const Home = () => {
  const { appTheme } = useContext(AppDataContext);
  const navigation = useNavigation<any>();
  const [listings, setListings] = useState([]);
  const profile = useSelector((state: RootState) => state.profile);
  const [ads, setAds] = useState([]);
  const [activeModal, setActiveModal] = useState<{
  postId: string | null;
  type: 'likes' | 'dislikes' | null;
}>({ postId: null, type: null });
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('animalListings')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const adsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAds(adsData);
      });

    return () => unsubscribe();
  }, []);

const formatDate = (date: Date) => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  const months = Math.floor(diffInDays / 30);
  const remainingDays = diffInDays % 30;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  } else if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''}${remainingDays > 0 ? ` ${remainingDays} day${remainingDays !== 1 ? 's' : ''}` : ''} ago`;
  } else {
    return `${years} year${years !== 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}` : ''}${remainingDays > 0 ? ` ${remainingDays} day${remainingDays !== 1 ? 's' : ''}` : ''} ago`;
  }
};



  const handleLike = async (id: string) => {
    const userId = profile.id;
    const userName = profile.name;
    const docRef = firestore().collection('animalListings').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return;
    const data = doc.data();
    const currentReaction = data?.reactions?.[userId];

    const updates: any = {};

    if (currentReaction === 'like') {
      updates.likes = firestore.FieldValue.increment(-1);
      updates[`reactions.${userId}`] = firestore.FieldValue.delete();
      updates.likedUsers = firestore.FieldValue.arrayRemove(userName);
    } else {
      if (currentReaction === 'dislike') {
        updates.dislikes = firestore.FieldValue.increment(-1);
        updates.dislikedUsers = firestore.FieldValue.arrayRemove(userName);
      }

      updates.likes = firestore.FieldValue.increment(1);
      updates[`reactions.${userId}`] = 'like';
      updates.likedUsers = firestore.FieldValue.arrayUnion(userName);
    }

    await docRef.update(updates);
  };

  const handleDislike = async (id: string) => {
    const userId = profile.id;
    const userName = profile.name;
    const docRef = firestore().collection('animalListings').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return;
    const data = doc.data();
    const currentReaction = data?.reactions?.[userId];

    const updates: any = {};

    if (currentReaction === 'dislike') {
      updates.dislikes = firestore.FieldValue.increment(-1);
      updates[`reactions.${userId}`] = firestore.FieldValue.delete();
      updates.dislikedUsers = firestore.FieldValue.arrayRemove(userName);
    } else {
      if (currentReaction === 'like') {
        updates.likes = firestore.FieldValue.increment(-1);
        updates.likedUsers = firestore.FieldValue.arrayRemove(userName);
      }

      updates.dislikes = firestore.FieldValue.increment(1);
      updates[`reactions.${userId}`] = 'dislike';
      updates.dislikedUsers = firestore.FieldValue.arrayUnion(userName);
    }

    await docRef.update(updates);
  };

  const deleteListing = async (id: string, ownerId: string) => {
    if (profile.phone !== ownerId && !profile.isAdmin) {
      // Alert.alert("Permission Denied", "You can only delete your own listings.");
      return;
    }
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await firestore().collection('animalListings').doc(id).delete();
              setListings(listings.filter(item => item.id !== id));
              Alert.alert("Success", "Listing deleted!");
            } catch (error) {
              Alert.alert("Error", "Failed to delete listing.");
            }
          }
        }
      ]
    );
  };

  const updateUserProfileImageInListings = async (userId: string, newImageUrl: string) => {
    try {
      const listingsRef = firestore().collection('animalListings');
      const userDocsSnapshot = await listingsRef.where('ownerId', '==', userId).get();

      const batch = firestore().batch();

      for (const userDoc of userDocsSnapshot.docs) {
        batch.update(userDoc.ref, { ownerImage: newImageUrl });

        const adsSnapshot = await userDoc.ref.collection('AdsList').get();
        adsSnapshot.forEach(adDoc => {
          batch.update(adDoc.ref, { ownerImage: newImageUrl });
        });
      }

      await batch.commit();
      console.log('Listings updated with new profile image');
    } catch (err) {
      console.log('Error updating listings:', err);
    }
  };

  useEffect(() => {
    if (profile.phone && profile.image) {
      updateUserProfileImageInListings(profile.phone, profile.image);
    }
  }, [profile.phone, profile.image]);

  const renderListingCard = ({ item }: any) => {
    const isMyAd = item.ownerId === profile.phone;
    const displayName = isMyAd ? profile.name : item.ownerName;
    const displayId = isMyAd ? profile.phone : item.ownerId;
 

    return (
      <View style={styles.topcontainer}>
        <View style={styles.userProfileSection}>
          {item.ownerImage ? (
            <Image
              source={{ uri: item.ownerImage }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.profileImage, styles.emptyProfileImage]}>
              <Icon name="person" size={50} color="#777" />
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName || 'Unknown'}</Text>
           {item.createdAt && (
  <Text style={styles.userDate}>
    {formatDate(item.createdAt.toDate())}
  </Text>
)}
          </View>
          <TouchableOpacity style={{ marginBottom: 15 }} onPress={() => deleteListing(item.id, displayId)}>
            <Icon name="more-vert" size={35} color="#000" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Detaile', { item })}>
          <View style={styles.profileCard}>
            {item.images?.length > 0 && (
              <>
                {item.images.length === 1 ? (
                  <Image
                    source={{ uri: item.images[0] }}
                    style={{ width: '100%', height: 200, borderRadius: 10 }}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imageRowContainer}>
                    <Image source={{ uri: item.images[0] }} style={styles.bigImage} />
                    <View style={styles.thumbnailsContainer}>
                      {item.images.slice(1, 4).map((img, index) => (
                        <Image key={index} source={{ uri: img }} style={styles.thumbnailImage} />
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}
            <View style={styles.container}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {item.likedUsers?.length > 0 && (
                  <TouchableOpacity onPress={() => setActiveModal({ postId: item.id, type: 'likes' })} >
                    <Text style={{ fontWeight: 'bold', color: 'green' }}>
                      {item.likedUsers.length === 1
                        ? item.likedUsers[0]
                        : `${item.likedUsers[0]} and ${item.likedUsers.length - 1} others`}
                    </Text>
                  </TouchableOpacity>
                )}

                {item.dislikedUsers?.length > 0 && (
                  <TouchableOpacity onPress={() => setActiveModal({ postId: item.id, type: 'dislikes' })} style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: 'bold', color: 'red', textAlign: 'right' }}>
                      {item.dislikedUsers.length === 1
                        ? item.dislikedUsers[0]
                        : `${item.dislikedUsers[0]} and ${item.dislikedUsers.length - 1} others`}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <Modal
          visible={activeModal.postId === item.id && activeModal.type === 'likes'}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setActiveModal({ postId: null, type: null })}
        >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <TouchableOpacity  onPress={() => setActiveModal({ postId: null, type: null })}style={styles.removeButton} >
                      <Text style={styles.removeButtonText}>✖</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Liked by</Text>
                    <ScrollView style={styles.scrollContainer}>
                      {(Array.isArray(item.likedUsers) ? item.likedUsers : []).map((user, index) => (
                        <Text key={index} style={styles.userText}>{user}</Text>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </Modal>

              <Modal
          visible={activeModal.postId === item.id && activeModal.type === 'dislikes'}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setActiveModal({ postId: null, type: null })}
        >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <TouchableOpacity onPress={() => setActiveModal({ postId: null, type: null })}  style={styles.removeButton}>
                      <Text style={styles.removeButtonText}>✖</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Disliked by</Text>
                    <ScrollView style={styles.scrollContainer}>
                      {(Array.isArray(item.dislikedUsers) ? item.dislikedUsers : []).map((user, index) => (
                        <Text key={index} style={styles.userText}>{user}</Text>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </Modal>
            </View>

            <View style={styles.reactionContainer}>
              <TouchableOpacity onPress={() => handleLike(item.id)}>
                <Text style={styles.reactionText}>👍 {item.likedUsers.length || 0}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDislike(item.id)}>
                <Text style={styles.reactionText}>👎 {item.dislikedUsers.length || 0}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      containers: {
        backgroundColor: appTheme.Primary,
      },
      heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
        paddingVertical: 15
      },
      topcontainer: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: 10
      },
      userProfileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#ddd',
        padding: 10
      },
      profileCard: {
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        elevation: 4,
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
      userInfo: {
        flex: 1,
      },
      userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
      },
      userDate: {
        fontSize: 14,
        color: '#888',
        lineHeight: 20,
        fontWeight: 'bold',
      },
      label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        padding: 6
      },
      image: {
        width: '100%',
        height: 160,
        marginTop: 10,
        borderRadius: 8,
        resizeMode: 'cover',
      },
      reactionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 3,
      },
      reactionText: {
        fontSize: 18,
        color: 'black',
        padding: 5,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
      },
      profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
      },
      removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'red',
        borderRadius: 20,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
      },
      removeButtonText: {
        color: 'white',
        fontSize: 25,
        lineHeight: 30,
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
      },
      scrollContainer: {
        maxHeight: 200,
      },
      userText: {
        fontSize: 16,
        marginVertical: 5,
      },
      imageRowContainer: {
        flexDirection: 'row',
        marginTop: 1,
      },
      bigImage: {
        width: 215,
        height: 220,
        borderRadius: 8,
        resizeMode: 'cover',
      },
      thumbnailsContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 5,
      },
      thumbnailImage: {
        width: 110,
        height: 70,
        borderRadius: 8,
        resizeMode: 'cover',
        marginBottom: 5,
      },
    });
  }, [appTheme])

  return (
    <View style={styles.container}>
      <View style={styles.containers}>
        <Text style={styles.heading}>Welcome {profile.name || ''}</Text>
      </View>
      <FlatList
        data={ads}
        renderItem={renderListingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default Home;