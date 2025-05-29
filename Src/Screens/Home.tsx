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
  const [showAllLikes, setShowAllLikes] = useState(false);
  const [showAllDislikes, setShowAllDislikes] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const profile = useSelector((state: RootState) => state.profile);
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const userId = profile.id || profile.phone || profile.uid || null;

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collectionGroup('AdsList')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (querySnapshot) => {
          const allAds = querySnapshot.docs.map(doc => ({
            id: doc.id,
            userId: doc.ref.parent.parent?.id,
            ...doc.data(),
            createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date()
          }));
          
          console.log('Ads updated:', allAds.length);
          setAds(allAds);
          setLoading(false);
        }, 
        (error) => {
          console.error('Error in real-time listener:', error);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
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
    if (profile.id && profile.image) {
      updateUserProfileImageInListings(profile.id, profile.image);
    }
  }, [profile.id, profile.image]);

  const handleLike = async (adId: string, ownerDocId: string) => {
    if (!profile?.id || !profile?.name) return;

    const userId = profile.id;
    const userName = profile.name;

    const docRef = firestore()
      .collection('animalListings')
      .doc(ownerDocId)
      .collection('AdsList')
      .doc(adId);

    try {
      const doc = await docRef.get();
      if (!doc.exists) return;

      const data = doc.data();
      const currentReaction = data?.reactions?.[userId];
      const updates: any = {};

      if (currentReaction === 'like') return;

      // Optimistic update
      setAds(prevAds => prevAds.map(ad => {
        if (ad.id === adId) {
          const updatedAd = {...ad};
          
          if (currentReaction === 'dislike') {
            updatedAd.dislikes = (updatedAd.dislikes || 0) - 1;
            updatedAd.dislikedUsers = (updatedAd.dislikedUsers || []).filter((u: string) => u !== userName);
          }

          updatedAd.likes = (updatedAd.likes || 0) + 1;
          updatedAd.reactions = {...updatedAd.reactions, [userId]: 'like'};
          updatedAd.likedUsers = [...(updatedAd.likedUsers || []).filter((u: string) => u !== userName), userName];
          
          return updatedAd;
        }
        return ad;
      }));

      // Then perform the actual update
      if (currentReaction === 'dislike') {
        updates.dislikes = firestore.FieldValue.increment(-1);
        updates.dislikedUsers = (data?.dislikedUsers || []).filter((u: string) => u !== userName);
      }

      updates.likes = firestore.FieldValue.increment(1);
      updates[`reactions.${userId}`] = 'like';
      updates.likedUsers = [...(data?.likedUsers || []).filter((u: string) => u !== userName), userName];

      await docRef.update(updates);
    } catch (error) {
      console.error('Error in like:', error);
      // Revert optimistic update if there's an error
      setAds(ads);
    }
  };

  const handleDislike = async (adId: string, ownerDocId: string) => {
    if (!profile?.id || !profile?.name) return;

    const userId = profile.id;
    const userName = profile.name;

    const docRef = firestore()
      .collection('animalListings')
      .doc(ownerDocId)
      .collection('AdsList')
      .doc(adId);

    try {
      const doc = await docRef.get();
      if (!doc.exists) return;

      const data = doc.data();
      const currentReaction = data?.reactions?.[userId];
      const updates: any = {};

      if (currentReaction === 'dislike') return;

      // Optimistic update
      setAds(prevAds => prevAds.map(ad => {
        if (ad.id === adId) {
          const updatedAd = {...ad};
          
          if (currentReaction === 'like') {
            updatedAd.likes = (updatedAd.likes || 0) - 1;
            updatedAd.likedUsers = (updatedAd.likedUsers || []).filter((u: string) => u !== userName);
          }

          updatedAd.dislikes = (updatedAd.dislikes || 0) + 1;
          updatedAd.reactions = {...updatedAd.reactions, [userId]: 'dislike'};
          updatedAd.dislikedUsers = [...(updatedAd.dislikedUsers || []).filter((u: string) => u !== userName), userName];
          
          return updatedAd;
        }
        return ad;
      }));

      // Then perform the actual update
      if (currentReaction === 'like') {
        updates.likes = firestore.FieldValue.increment(-1);
        updates.likedUsers = (data?.likedUsers || []).filter((u: string) => u !== userName);
      }

      updates.dislikes = firestore.FieldValue.increment(1);
      updates[`reactions.${userId}`] = 'dislike';
      updates.dislikedUsers = [...(data?.dislikedUsers || []).filter((u: string) => u !== userName), userName];

      await docRef.update(updates);
    } catch (error) {
      console.error('Error in dislike:', error);
      // Revert optimistic update if there's an error
      setAds(ads);
    }
  };

  const deleteListing = async (adId: string, ownerDocId: string) => {
    if (userId !== ownerDocId && !profile.isAdmin) {
      Alert.alert("Error", "You don't have permission to delete this listing");
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
              // Optimistic update - remove from state immediately
              setAds(prevAds => prevAds.filter(ad => ad.id !== adId));
              
              // Then perform the actual delete operation
              const adToDelete = ads.find(ad => ad.id === adId);
              if (!adToDelete) return;

              await firestore()
                .collection('animalListings')
                .doc(adToDelete.userId)
                .collection('AdsList')
                .doc(adId)
                .delete();

              // The real-time listener will handle the confirmation
            } catch (error) {
              // Revert if there's an error
              setAds(ads); // Reset to previous state
              console.error('Delete error:', error);
              Alert.alert("Error", "Failed to delete listing");
            }
          }
        }
      ]
    );
  };

  const renderListingCard = ({ item }: any) => {
    const isMyAd = item.ownerId === profile.phone;
    const displayName = isMyAd ? profile.name : item.ownerName;
    const displayId = isMyAd ? profile.phone : item.ownerId;
    
    return (
      <View style={styles.topcontainer}>
        <View style={styles.userProfileSection}>
          {item.ownerImage ? (
            <Image
              source={{ uri: item.ownerId === profile.phone ? profile.image : item.ownerImage }}
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
                {`${item.createdAt.toLocaleTimeString()}\n${formatDate(item.createdAt)}`}
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
                  <TouchableOpacity onPress={() => setShowAllLikes(true)} style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', color: 'green' }}>
                      {item.likedUsers.length === 1
                        ? item.likedUsers[0]
                        : `${item.likedUsers[0]} and ${item.likedUsers.length - 1} others`}
                    </Text>
                  </TouchableOpacity>
                )}

                {item.dislikedUsers?.length > 0 && (
                  <TouchableOpacity onPress={() => setShowAllDislikes(true)} style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: 'bold', color: 'red', textAlign: 'right' }}>
                      {item.dislikedUsers.length === 1
                        ? item.dislikedUsers[0]
                        : `${item.dislikedUsers[0]} and ${item.dislikedUsers.length - 1} others`}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <Modal
                visible={showAllLikes}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowAllLikes(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <TouchableOpacity onPress={() => setShowAllLikes(false)} style={styles.removeButton}>
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
                visible={showAllDislikes}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowAllDislikes(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <TouchableOpacity onPress={() => setShowAllDislikes(false)} style={styles.removeButton}>
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
              <TouchableOpacity onPress={() => handleLike(item.id, item.userId)}>
                <Text style={styles.reactionText}>👍 {item.likes || 0}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDislike(item.id, item.userId)}>
                <Text style={styles.reactionText}>👎 {item.dislikes || 0}</Text>
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
        paddingHorizontal: 5,
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
    });
  }, [appTheme]);

  return (
    <View style={styles.container}>
      <View style={styles.containers}>
        <Text style={styles.heading}>Welcome {profile.name || ''}</Text>
      </View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading ads...</Text>
        </View>
      ) : (
        <FlatList
          data={ads}
          renderItem={renderListingCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
              <Text>No ads available</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default Home;