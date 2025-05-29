import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = firestore()
      .collection('animalListings')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const listingsData = [];
        
        querySnapshot.forEach(documentSnapshot => {
          listingsData.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });

        setListings(listingsData);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <FlatList
      data={listings}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.listingContainer}>
          {item.images && item.images.length > 0 && (
            <Image source={{ uri: item.images[0] }} style={styles.listingImage} />
          )}
          <Text style={styles.listingTitle}>{item.category}</Text>
          <Text>Price: {item.price} PKR</Text>
          <Text>Location: {item.location}</Text>
          <Text>Contact: {item.phoneNumber}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listingContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listingImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default Listings;