// Src/Navigation/BottomTabs.js
import React, { Profiler } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Home from './Home';
import Search from './Search';
import Sell from './Sell';
import profile from './Profile';


const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Search') iconName = 'search-outline';
          else if (route.name === 'Sell') iconName = 'add-circle-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Sell" component={Sell} />
      <Tab.Screen name="Profile" component={profile} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
