import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Image } from 'react-native';
import DefaultProfile from '../images/person.jpg';
interface ProfileState {
  name: string;
  phone: string;
  location: string;
  image: string | null;
  defaultImage: string;
  createdAt?: string;
   isAdmin: boolean;
}

// Resolve image URI for static image
const defaultImageUri = Image.resolveAssetSource(DefaultProfile).uri;

const initialState: ProfileState = {
  name: '',
  phone: '',
  image: null,
  location: '',
  defaultImage: defaultImageUri,
  createdAt: undefined,
  isAdmin: false, 
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Partial<ProfileState>>) => {
      return { ...state, ...action.payload };
    },
    resetProfile: () => initialState,
  },
});

export const { setProfile, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
