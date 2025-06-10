import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Modal, TouchableOpacity, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Header } from './Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppDataContext } from '../context/AppDataContext';

const Detaile = () => {
  const { appTheme } = useContext(AppDataContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const route = useRoute<any>();
  const { item } = route.params;
  const profile = useSelector((state: RootState) => state.profile);
  const openModal = (imgUri: string) => {
    setSelectedImage(imgUri);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };
  const navigateImage = (direction: 'left' | 'right') => {
    if (!item.images || item.images.length === 0) return;

    let newIndex;
    if (direction === 'left') {
      newIndex = currentImageIndex === 0 ? item.images.length - 1 : currentImageIndex - 1;
    } else {
      newIndex = currentImageIndex === item.images.length - 1 ? 0 : currentImageIndex + 1;
    }

    setCurrentImageIndex(newIndex);
    setSelectedImage(item.images[newIndex]);
  };
  const styles = StyleSheet.create({
    profileview: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: 10,
      borderWidth: 1,
      borderColor: appTheme.TextPrimary,
      marginBottom: 10,
    },
    descriptionBox: {
      flex: 1,
      paddingLeft: 5,
      paddingRight: 5,
    },
    leftview: {
      width: 80,
      borderLeftWidth: 1,
      borderLeftColor: appTheme.TextPrimary,
      paddingLeft: 5,
      justifyContent: 'flex-start',
    },
    userPhone: {
      fontSize: 16,
      color: appTheme.TextPrimary,
      flexWrap: 'wrap',
      flexShrink: 1,
      lineHeight: 22,
    },
    containers: {
      flex: 1,
      backgroundColor: '#fff',
    },
    container: {
      padding: 16,
      backgroundColor: appTheme.Background,
    },
    userInfo: {
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: appTheme.TextPrimary,
      paddingBottom: 10,
    },
    name: {
      justifyContent: "center",
      alignSelf: "center",
      marginBottom: 5,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      color: appTheme.TextPrimary
    },
    userName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: appTheme.TextPrimary,
      padding: 10
    },
    userLocation: {
      fontSize: 16,
      color: appTheme.TextPrimary,
    },
    userDate: {
      fontSize: 14,
      color: appTheme.TextPrimary,
      marginTop: 5,
      lineHeight: 20,
    },
    listingDetails: {
      marginTop: 10,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 10,
      color: appTheme.TextPrimary,
    },
    value: {
      fontSize: 16,
      color: appTheme.TextPrimary,
    },
    imagesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    image: {
      width: 155,
      height: 155,
      marginBottom: 10,
      borderRadius: 10,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalCloseArea: {
      position: 'absolute',
      top: 0, bottom: 0, left: 0, right: 0,
    },
    fullImage: {
      width: '100%',
      height: '80%',
      borderRadius: 10,
    },
    closeButton: {
      marginTop: 20,
      paddingVertical: 15,
      paddingHorizontal: 30,
      backgroundColor: '#fff',
      borderRadius: 20,
    },
    closeButtonText: {
      color: '#000',
      fontWeight: 'bold',
      fontSize: 16,
    },
    removeButton: {
      position: 'absolute',
      top: 15,
      right: 15,
      backgroundColor: 'white',
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeButtonText: {
      color: 'black',
      fontSize: 35,
      lineHeight: 30,
    },
    navButtonLeft: {
      position: 'absolute',
      left: 10,
      zIndex: 1,
      padding: 10,
    },
    navButtonRight: {
      position: 'absolute',
      right: 10,
      zIndex: 1,
      padding: 10,
    },
  });
  return (
    <View style={styles.containers}>
      <Header title="Details" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.userInfo}>
          <View style={styles.name}>
            {profile.name && <Text style={styles.userName}>Name:{item.ownerName}</Text>}
          </View>
          <View style={styles.profileview}>
            <View>
              <Text style={styles.userPhone}>Phone Number</Text>
              {item.ownerPhone && (
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.ownerPhone}`)}>
                  <Text style={[styles.userPhone, { color: 'blue', textDecorationLine: 'underline' }]}>
                    {item.ownerPhone}
                  </Text>
                </TouchableOpacity>
              )}

            </View>
            <View style={styles.leftview}>
              <Text style={styles.userPhone}>Category</Text>
              <Text style={styles.userPhone}>{item.category}</Text>
            </View>
          </View>
          <View style={styles.profileview}>
            <View>
              <Text style={styles.userPhone}>Price</Text>
              <Text style={styles.userPhone}>Rs. {item.price} </Text>
            </View>
            <View style={styles.leftview}>
              <Text style={styles.userPhone}>Gender</Text>
              <Text style={styles.userPhone}>{item.gender}</Text>
            </View>
          </View>
          <View style={styles.profileview}>
            <View>
              <Text style={styles.userLocation}>Address</Text>
              {item.location && <Text style={styles.userLocation}>{item.location}</Text>}
            </View>

            <View style={styles.leftview}>
              <Text style={styles.userPhone}>Age </Text>
              <Text style={styles.userPhone}>{item.age}</Text>
            </View>

          </View>
          <View style={styles.profileview}>
            <View style={styles.descriptionBox}>
              <Text style={styles.userPhone}>Description</Text>
              <Text style={styles.userPhone}>{item.message}</Text>
            </View>

            <View style={styles.leftview}>
              <Text style={styles.userPhone}>Weight</Text>
              <Text style={styles.userPhone}>{item.weight} Kg</Text>
            </View>
          </View>
        </View>

        <View style={styles.imagesContainer}>
          {item.images?.map((imgUri: string, index: number) => (
            <TouchableOpacity key={index} onPress={() => openModal(imgUri)}>
              <Image source={{ uri: imgUri }} style={styles.image} />
            </TouchableOpacity>
          ))}
        </View>
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity style={styles.modalCloseArea} onPress={closeModal} />

            {/* Left Button */}
            <TouchableOpacity
              style={[
                styles.navButtonLeft,
                (item.images.length === 1 || currentImageIndex === 0) && { opacity: 0.1 },
              ]}
              onPress={() => navigateImage('left')}
              activeOpacity={0.7}
              disabled={item.images.length === 1 || currentImageIndex === 0}
            >
              <Icon name="chevron-left" size={30} color="white" />
            </TouchableOpacity>

            {/* Main Image */}
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
            )}

            {/* Right Button */}
            <TouchableOpacity
              style={[
                styles.navButtonRight,
                (item.images.length === 1 || currentImageIndex === item.images.length - 1) && { opacity: 0.1 },
              ]}
              onPress={() => navigateImage('right')}
              activeOpacity={0.7}
              disabled={item.images.length === 1 || currentImageIndex === item.images.length - 1}
            >
              <Icon name="chevron-right" size={30} color="white" />
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity style={styles.removeButton} onPress={closeModal}>
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};
export default Detaile;
