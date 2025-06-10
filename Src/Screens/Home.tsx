import { StyleSheet, Text, TouchableOpacity, View, Image, FlatList, Alert, ScrollView, Modal, TextInput, Keyboard, RefreshControl, Share } from 'react-native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppDataContext } from '../context/AppDataContext';
import createStyles from '../styles/stylesheethome';
import Entypo from 'react-native-vector-icons/Entypo'
const Home = () => {
  const { appTheme } = useContext(AppDataContext);
  const styles = useMemo(() => createStyles(appTheme), [appTheme]);
  const navigation = useNavigation<any>();
  const [listings, setListings] = useState([]);
  const profile = useSelector((state: RootState) => state.profile);
  const [ads, setAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [profileImageVisible, setProfileImageVisible] = useState(false);
   const [selectedImage, setSelectedImage] = useState('');
  const [activeModal, setActiveModal] = useState<{
    postId: string | null;
    type: 'likes' | 'dislikes' | 'comments' | null;
  }>({ postId: null, type: null });
  const [commentText, setCommentText] = useState('');
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<{
    [postId: string]: Array<{
      id: string;
      userId: string;
      userName: string;
      userImage: string;
      text: string;
      createdAt: Date;
    }>
  }>({});
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // Added refreshing state

  const currentUserId = profile.id;
  const animalCategories = [
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
  ];

  // Function to fetch ads data
  const fetchAds = async () => {
    try {
      const snapshot = await firestore()
        .collection('animalListings')
        .orderBy('createdAt', 'desc')
        .get();
      
      const adsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAds(adsData);
      fetchCommentCounts(); 
    } catch (error) {
      console.error('Error fetching ads:', error);
      Alert.alert('Error', 'Failed to load ads');
    } finally {
      setRefreshing(false); // Stop refreshing indicator
    }
  };

  // Function to handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchAds();
  };

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
        fetchCommentCounts(); 
      });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const uniqueCategories = Array.from(new Set(ads.map(ad => ad.category).filter(Boolean)))
    setCategories(uniqueCategories);
  }, [ads]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(category);
    setShowCategoryDropdown(false);
  };

  const filteredAds = ads.filter(ad => {
    const query = searchQuery.toLowerCase();
    return (
      ad.category?.toLowerCase().includes(query)
      //  ||
      // ad.name?.toLowerCase().includes(query) 

    );
  });

 const formatDate = (date: Date) => {
  if (!date) return 'Just now';

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Approximate months and years based on days
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hr ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
  }
};
  const fetchComments = async (postId: string) => {
    try {
      const commentsSnapshot = await firestore()
        .collection('animalListings')
        .doc(postId)
        .collection('comments')
        .orderBy('createdAt', 'desc')
        .get();

      const commentsData = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));

      setComments(prev => ({
        ...prev,
        [postId]: commentsData
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      Alert.alert('Error', 'Failed to load comments');
    }
  };

  // Function to fetch comment counts for all posts
const fetchCommentCounts = async () => {
  try {
    const listingsSnapshot = await firestore().collection('animalListings').get();
    
    const counts: Record<string, number> = {};
    await Promise.all(listingsSnapshot.docs.map(async (doc) => {
      const commentsSnapshot = await firestore()
        .collection('animalListings')
        .doc(doc.id)
        .collection('comments')
        .get();
      counts[doc.id] = commentsSnapshot.size;
    }));
    
    setCommentCounts(counts);
  } catch (error) {
    console.error('Error fetching comment counts:', error);
  }
};

// Call this when your component mounts or when posts are loaded
useEffect(() => {
  fetchCommentCounts();
}, []);
const handleAddComment = async (postId: string) => {
  Keyboard.dismiss();
  if (!commentText.trim()) {
    Alert.alert('Error', 'Comment cannot be empty');
    return;
  }

  if (!profile.id || !profile.name) {
    Alert.alert('Error', 'User information missing');
    return;
  }

  setIsPostingComment(true);
  const tempCommentId = Date.now().toString();

  try {
    const newComment = {
      id: tempCommentId,
      userId: profile.id,
      userName: profile.name,
      userImage: profile.image || '',
      text: commentText,
      createdAt: new Date()
    };

    // Optimistic update for both comments and count
    setComments(prev => ({
      ...prev,
      [postId]: [newComment, ...(prev[postId] || [])]
    }));
    setCommentCounts(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1
    }));
    setCommentText('');

    // Add to Firestore
    const { id: _, ...commentData } = newComment;
    await firestore()
      .collection('animalListings')
      .doc(postId)
      .collection('comments')
      .add({
        ...commentData,
        createdAt: firestore.FieldValue.serverTimestamp()
      });
    // Refresh comments to get server timestamp and actual ID
    await fetchComments(postId);

    // Update count from server to ensure accuracy
    const commentsSnapshot = await firestore()
      .collection('animalListings')
      .doc(postId)
      .collection('comments')
      .get();
    setCommentCounts(prev => ({
      ...prev,
      [postId]: commentsSnapshot.size
    }));
  } catch (error) {
    console.error('Error adding comment:', error);
    // Rollback optimistic updates
    setComments(prev => ({
      ...prev,
      [postId]: (prev[postId] || []).filter(c => c.id !== tempCommentId)
    }));
    setCommentCounts(prev => ({
      ...prev,
      [postId]: Math.max(0, (prev[postId] || 0) - 1)
    }));
    Alert.alert('Error', 'Failed to post comment');
  } finally {
    setIsPostingComment(false);
  }
};

  const handleLike = async (id: string) => {
    const userId = profile.id;
    const userName = profile.name;
    const docRef = firestore().collection('animalListings').doc(id);

    try {
      const doc = await docRef.get();
      if (!doc.exists) return;

      const data = doc.data();
      const reactions = data?.reactions || {};
      const currentReaction = reactions[userId];

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
    } catch (error) {
      console.error('Error updating like:', error);
      Alert.alert('Error', 'Failed to update reaction');
    }
  };

  const deleteListing = async (id: string, ownerId: string) => {
    if (profile.id !== ownerId && !profile.isAdmin) {
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
              setAds(ads.filter(item => item.id !== id));
              Alert.alert("Success", "Listing deleted!");
            } catch (error) {
              console.error('Error deleting listing:', error);
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
    } catch (err) {
      console.log('Error updating listings:', err);
    }
  };
  useEffect(() => {
    if (profile.id && profile.image) {
      updateUserProfileImageInListings(profile.id, profile.image);
    }
  }, [profile.id, profile.image]);

  useEffect(() => {
    if (activeModal.type === 'comments' && activeModal.postId) {
      fetchComments(activeModal.postId);
    }
  }, [activeModal.type, activeModal.postId]);

  const handleOpenComments = (postId: string) => {
    setActiveModal({ postId, type: 'comments' });
  };

  const confirmDeleteComment = (postId: string, commentId: string) => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteComment(postId, commentId),
        },
      ],
      { cancelable: true }
    );
  };
 const handleDeleteComment = async (postId: string, commentId: string) => {
  try {
    await firestore()
      .collection('animalListings')
      .doc(postId)
      .collection('comments')
      .doc(commentId)
      .delete();

    setComments(prev => {
      const updated = { ...prev };
      updated[postId] = updated[postId].filter(c => c.id !== commentId);
      return updated;
    });
    setCommentCounts(prev => ({
      ...prev,
      [postId]: Math.max(0, (prev[postId] || 0) - 1)
    }));
  } catch (error) {
    console.error('Error deleting comment:', error);
    Alert.alert('Error', 'Failed to delete comment');
  }
};
  const renderListingCard = ({ item }: any) => {
    const isMyAd = item.ownerId === profile.id;
    const displayName = isMyAd ? profile.name : item.ownerName;
    const displayId = isMyAd ? profile.id : item.ownerId;
    const openFullScreenImage = (imageUri: string) => {
    setSelectedImage(imageUri);
    setProfileImageVisible(true);
  };
  const navigateToUserAds = () => {
    navigation.navigate('UserAds', { 
      ownerId: item.ownerId,
       ownerName: item.ownerName ,
       ownerImage: item.ownerImage,
    });
  }
    return (
      <View style={styles.topcontainer}>
        <View style={styles.userProfileSection}>
        <View style={styles.userProfileSections}>
  {item.ownerImage ? (
     <TouchableOpacity onPress={() => openFullScreenImage(item.ownerImage)}>
      <Image
        source={{ uri: item.ownerImage }}
        style={styles.profileImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  ) : (
    <View style={[styles.profileImage, styles.emptyProfileImage]}>
      <Icon name="person" size={50} color="#777" />
    </View>
  )}
</View>
          <View style={styles.userInfo}>
           <TouchableOpacity onPress={navigateToUserAds}>
            <Text style={styles.userName}>{displayName || 'Unknown'}</Text>
         
            {item.createdAt && (
              <Text style={styles.userDate}>
                {formatDate(item.createdAt.toDate())}
              </Text>
            )}
             </TouchableOpacity>
          </View>
          {(isMyAd || profile.isAdmin) && (
            <TouchableOpacity style={{ marginBottom: 15 }} onPress={() => deleteListing(item.id, displayId)}>
              <Icon name="more-vert" size={35} color="#000" />
            </TouchableOpacity>
          )}
        </View>
        <Modal
        visible={profileImageVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setProfileImageVisible(false)}
      >
        <View style={styles.fullImageModalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setProfileImageVisible(false)}
          >
            <Icon name="close" size={30} color="black" />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
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
                      {item.images.slice(1, 4).map((img: string, index: number) => (
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
  <TouchableOpacity onPress={() => setActiveModal({ postId: item.id, type: 'likes' })}>
    <Text style={{ fontWeight: 'bold', color: 'green' }}>
      {item.likedUsers.includes(profile.name)
        ? item.likedUsers.length === 1
          ? "You"
          : `You and ${item.likedUsers.length - 1} other${item.likedUsers.length > 2 ? 's' : ''}`
        : item.likedUsers.length === 1
          ? item.likedUsers[0]
          : `${item.likedUsers[0]} and ${item.likedUsers.length - 1} other${item.likedUsers.length > 2 ? 's' : ''}`}
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
                    <TouchableOpacity onPress={() => setActiveModal({ postId: null, type: null })} style={styles.removeButton}>
                      <Text style={styles.removeButtonText}>✖</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Liked by</Text>
                    <ScrollView style={styles.scrollContainer}>
                      {(Array.isArray(item.likedUsers) ? item.likedUsers : []).map((user: string, index: number) => (
                        <Text key={index} style={styles.userText}>{user}</Text>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </Modal>

            </View>

            <View style={styles.reactionContainer}>
              <TouchableOpacity onPress={() => handleLike(item.id)}>
                <Text style={styles.reactionText}>❤️ Like ({item.likedUsers.length|| 0})</Text>
              </TouchableOpacity>
               <TouchableOpacity onPress={() => handleOpenComments(item.id)}>
  <Text style={styles.reactionText}>
    💬 Comment({commentCounts[item.id] !== undefined ? commentCounts[item.id] : '...'})
  </Text>
</TouchableOpacity>

            </View>

            <Modal
              visible={activeModal.postId === item.id && activeModal.type === 'comments'}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setActiveModal({ postId: null, type: null })}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    onPress={() => setActiveModal({ postId: null, type: null })}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>✖</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Comments</Text>

                  <View style={styles.commentInputContainer}>
                    <TextInput
                      style={styles.commentInput}
                      placeholder="Write a comment..."
                      value={commentText}
                      onChangeText={setCommentText}
                      multiline
                    />
                    <TouchableOpacity
                      style={styles.commentPostButton}
                    
                onPress={() => {
 
  handleAddComment(item.id);
}}
                      
                      disabled={isPostingComment || !commentText.trim()}
                    >
                      <Text style={styles.commentPostButtonText}>
                        {isPostingComment ? 'Posting...' : 'Post'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.commentsScrollContainer}>
                    {comments[item.id]?.length > 0 ? (
                      comments[item.id].map((comment) => (
                        <View key={comment.id} style={styles.commentContainer}>
                          {comment.userImage ? (
                            <Image
                              source={{ uri: comment.userImage }}
                              style={styles.commentUserImage}
                            />
                          ) : (
                            <View style={[styles.commentUserImage, styles.emptyProfileImage]}>
                              <Icon name="person" size={30} color="#777" />
                            </View>
                          )}
                          <View style={styles.commentContent}>
                            <Text style={styles.commentUserName}>{comment.userName}</Text>
                            <Text style={styles.commentText}>{comment.text}</Text>
                            <Text style={styles.commentTime}>{formatDate(comment.createdAt)}</Text>
                            {comment.userId === currentUserId && (
                              <TouchableOpacity onPress={() => confirmDeleteComment(item.id, comment.id)}>
                                <Text style={{ color: 'red', marginTop: 4 }}>Delete</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.noCommentsText}>No comments yet</Text>
                    )}
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

const shareText =()=>{
  Share.share({
    message:"https://play.google.com/store/apps/details?id=com.solarcalculate"
  })
}
  return (
    <View style={styles.container}>
      <View style={styles.containers}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          {profile.image ? (
            <Image source={{ uri: profile.image }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, styles.emptyProfileImage]}>
              <Icon name="person" size={50} color="#777" />
            </View>
          )}
        </TouchableOpacity>
       <Text style={styles.heading}>
  {profile.name ? (profile.name.length > 15 ? profile.name.substring(0, 15) + '...' : profile.name) : ''}
</Text>  
         <View style={styles.btnContainer}>
       <TouchableOpacity style={styles.iconContainer} onPress={shareText}>
          <Entypo name="share" size={30} color={"white"} />
        </TouchableOpacity>
      </View>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchIconContainer}>
          <Icon name="search" size={24} color="#888" />
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Select Animal name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={appTheme.TextPrimary}
        />

        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
        > <Icon name={showCategoryDropdown ? "arrow-drop-up" : "arrow-drop-down"} size={50} color="#888" />
        </TouchableOpacity>
      </View>

      {showCategoryDropdown && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={animalCategories}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleCategorySelect(item.value)}
              >
                <Text style={styles.dropdownItemText}>{item.label}

                </Text>
              </TouchableOpacity>
            )}
            ListHeaderComponent={
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleCategorySelect('')}
              >
                <Text style={[styles.dropdownItemText, styles.allCategoriesText]}>All Categories</Text>
              </TouchableOpacity>
            }
            style={styles.dropdownScroll}
          />
        </View>
      )}

      {(searchQuery || selectedCategory) && (filteredAds.length === 0) ? (
        <View style={styles.emptyContainer}>

          <Text style={styles.emptyText}>No animals found</Text>
          <Text style={styles.emptySubText}>Try a different search term </Text>
        </View>
      ) : (
         <FlatList
          data={searchQuery ? filteredAds : ads}
          renderItem={renderListingCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#9Bd35A', '#689F38']} 
              tintColor="#689F38" 
            />
          }
        />
      )}

    </View>
  );
};

export default Home;