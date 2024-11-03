import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

//Screens
import HomePage from './Screen/HomePage';
import OrderPage from './Screen/OrderPage';
import Profile from './Screen/Profile';
import Settings from './Screen/Settings';

const homeName = 'Home';
const orderName = 'Order';
const customerName = 'Profile';
const settingsName = 'Settings';

const Tab = createBottomTabNavigator();

const Dashboard = () => {
    return (
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;
  
            if (rn === homeName) {
              iconName = focused ? 'home' : 'home-outline';
            } else if (rn === orderName) {
              iconName = focused ? 'cart' : 'cart-outline';
            } else if (rn === customerName) {
              iconName = focused ? 'person' : 'person-outline';
            } else if (rn === settingsName) {
              iconName = focused ? 'settings' : 'settings-outline';
            }
  
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#3498DB",
                tabBarInactiveTintColor: "black",
                tabBarStyle: { paddingBottom: 10, height: 60 },
        })}
      >
        <Tab.Screen name={homeName} component={HomePage} />
        <Tab.Screen name={orderName} component={OrderPage} />
        <Tab.Screen name={customerName} component={Profile} />
        <Tab.Screen name={settingsName} component={Settings} />
      </Tab.Navigator>
    );
  };

export default Dashboard

const styles = StyleSheet.create({})