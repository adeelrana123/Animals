

import { StyleSheet } from 'react-native';

const createStyles = (appTheme) => StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor:appTheme.Background,
      },
      containers: {
         flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
       paddingLeft: 15,
       
        backgroundColor: appTheme.Primary,
      },
      heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        // marginBottom: 10,
        textAlign: 'center',
        paddingVertical: 15
      },
      topcontainer: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: 10,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginBottom: 10,
      },
      userProfileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        padding: 10,
        backgroundColor: '#f9f9f9',
      },
       userProfileSections: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderBottomWidth: 1,
        // borderBottomColor: '#ddd',
        padding: 10,
        backgroundColor: '#f9f9f9',
      },
      profileCard: {
        paddingHorizontal: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
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
        marginTop: 5,
        // paddingHorizontal: 10,
      },
      reactionText: {
        fontSize: 16,
        color: 'black',
        padding: 5,
        paddingHorizontal: 10,
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
        width: '90%',
        maxHeight: '80%',
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
        zIndex: 1,
      },
      removeButtonText: {
        color: 'white',
        fontSize: 16,
        lineHeight: 18,
        textAlign: 'center',
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
      },
      scrollContainer: {
        maxHeight: 200,
      },
      userText: {
        fontSize: 16,
        marginVertical: 5,
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      },
      imageRowContainer: {
        flexDirection: 'row',
        marginTop: 10,
        height: 220,
      },
      bigImage: {
        width: '60%',
        height: '100%',
        borderRadius: 8,
        resizeMode: 'cover',
      },
      thumbnailsContainer: {
        width: '40%',
        marginLeft: 5,
        justifyContent: 'space-between',
      },
      thumbnailImage: {
        width: '100%',
        height: '32%',
        borderRadius: 8,
        resizeMode: 'cover',
      },
      // commentButton: {
      //   padding: 10,
      //   borderTopWidth: 1,
      //   borderTopColor: '#ddd',
      //   alignItems: 'center',
      //   marginTop: 5,
      // },
      // commentButtonText: {
      //   fontSize: 16,
      //   color: '#333',
      // },
      commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        
      },
      commentInput: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
        maxHeight: 100,
      },
      commentPostButton: {
        padding: 10,
        backgroundColor: appTheme.Primary,
        borderRadius: 5,
        
       
      },
      commentPostButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
      commentsScrollContainer: {
        maxHeight: 300,
      },
      commentContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      },
      commentUserImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
      },
      commentContent: {
        flex: 1,
      },
      commentUserName: {
        fontWeight: 'bold',
        marginBottom: 3,
      },
      commentText: {
        fontSize: 14,
        marginBottom: 3,
      },
      commentTime: {
        fontSize: 12,
        color: '#888',
      },
      noCommentsText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
        fontStyle: 'italic',
      },




  searchInput: {
  height: 35,
  borderColor: 'gray',
  borderWidth: 1,
  borderRadius: 10,
  paddingHorizontal: 10,
  // marginBottom: 10,
  backgroundColor: '#fff',
},
emptyContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},
emptyText: {
  fontSize: 18,
  color: '#666',
},
adInfoContainer: {
  padding: 10,
},
adTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 5,
},
adBreed: {
  fontSize: 16,
  color: '#555',
  marginBottom: 5,
},
adPrice: {
  fontSize: 16,
  fontWeight: 'bold',
  color: 'green',
  marginBottom: 5,
},
adDescription: {
  fontSize: 14,
  color: '#666',
},

  categoryIcon: {
    padding: 5,
  },
  categoryDropdown: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: '#fff',
    elevation: 3,
  },
  categoryScroll: {
    paddingHorizontal: 5,
  },
  categoryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedCategoryItem: {
    backgroundColor: '#f0f0f0',
  },
  categoryItemText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
   searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    height: 50,
  },
  searchIconContainer: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#000',
  },
  dropdownButton: {
    marginLeft: 10,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 115,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
    zIndex: 1000,
    maxHeight: 260,
  },
  dropdownScroll: {
    padding: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
   dropdownItemText: {
    fontSize: 16,
  },
  allCategoriesText: {
    fontWeight: 'bold',
    color: '#1a73e8',
  },
   emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
   emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },

 fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 10,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
  },
  fullImageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
   iconContainer: {
        marginRight: 20,
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
      },
      btnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: appTheme.Primary,
        
      },
    });
 export default createStyles;
