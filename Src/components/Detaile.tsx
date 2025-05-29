import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Header } from './Header';

const Detaile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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


  return (
    <View style={styles.containers}>
      <Header title="Details" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.userInfo}>
          <View style={styles.name}>
            {profile.name && <Text style={styles.userName}>Name: {profile.name}</Text>}
          </View>
          <View style={styles.profileview}>
            <View>
              <Text style={styles.userPhone}>Phone Number </Text>
              {profile.phone && <Text style={styles.userPhone}>{profile.phone}</Text>}
            </View>

            <View style={styles.leftview }>
              <Text style={styles.userPhone}>Category</Text>
              <Text style={styles.userPhone}>{item.category}</Text>
            </View>
          </View>
          <View style={styles.profileview}>
            <View>
              <Text style={styles.userPhone}>Price</Text>
              <Text style={styles.userPhone}>{item.price} PKR</Text>
            </View>
           <View style={styles.leftview }>
              <Text style={styles.userPhone}>Gender</Text>
              <Text style={styles.userPhone}>{item.gender}</Text>
            </View>
          </View>
          <View style={styles.profileview}>
            <View>
              <Text style={styles.userLocation}>Address</Text>
              {profile.location && <Text style={styles.userLocation}>{profile.location}</Text>}
            </View>

           <View style={styles.leftview }>
              <Text style={styles.userPhone}>Age </Text>
              <Text style={styles.userPhone}>{item.age} Year</Text>
            </View>

          </View>
          <View style={styles.profileview}>
            <View>
              <Text style={styles.userPhone}>Description</Text>
              <Text style={styles.userPhone}>{item.message}</Text>
            </View>
           <View style={styles.leftview }>
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
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
              
            )}
             <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={closeModal 
                        }
                      >
                        <Text style={styles.removeButtonText}>×</Text>
                      </TouchableOpacity>

            {/* <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity> */}
          </View>
        </Modal>

    
    </ScrollView>
      </View>
  );
};

const styles = StyleSheet.create({
  containers: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  userInfo: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  profileview: {
     width:"100%",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 55,
    borderWidth: 1,
    borderColor: "black",
    paddingHorizontal: 10,
  },
  leftview: {
    width:"25%",
    borderLeftWidth: 1,
    borderLeftColor: 'black',
    paddingLeft: 5,

  },
  name: {
    justifyContent: "center",
    alignSelf: "center", marginBottom: 5
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    padding:10
  },
  userLocation: {
    fontSize: 16,
    color: '#555',
  },
  userPhone: {
    fontSize: 16,
    color: '#555',
  },
  userDate: {
    fontSize: 14,
    color: '#888',
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
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#555',
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
    backgroundColor: 'rgba(0,0,0,0.9)',
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

});

export default Detaile;
