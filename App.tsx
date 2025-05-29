import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import SplashScreen from './Src/Screens/SplashScreen';
import BottomTabs from './Src/Screens/BottomTabs';
import Listings from './Src/components/Listing';
import CreateProfile from './Src/Screens/CreateProfile';
import { persistor, store } from './Src/redux';
import Detaile from './Src/components/Detaile';
import ProfileScreen from './Src/components/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
     <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="Home" component={BottomTabs} />
            <Stack.Screen name="CreateProfile" component={CreateProfile} />
            <Stack.Screen name="Listings" component={Listings} />
            <Stack.Screen name="Detaile" component={Detaile} />
             <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}