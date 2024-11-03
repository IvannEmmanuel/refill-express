import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]); // State for storing orders

  useEffect(() => {
    // Load user data and orders from AsyncStorage when the app starts
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          setUserProfile(JSON.parse(userData));
        }

        const ordersData = await AsyncStorage.getItem('userOrders'); // Load orders
        if (ordersData) {
          setOrders(JSON.parse(ordersData));
        }
      } catch (error) {
        console.error('Error loading user data or orders:', error);
      }
    };

    loadUserData();
  }, []);

  const updateUserProfile = async (userData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setUserProfile(userData);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const clearUserProfile = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUserProfile(null);
      await AsyncStorage.removeItem('userOrders'); // Clear orders
      setOrders([]); // Reset orders in state
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  const fetchUserOrders = async (userId) => {
    try {
      const response = await fetch(`http://192.168.1.5:3000/api/users/${userId}`);
      const data = await response.json();

      if (response.ok) {
        return data; // Return the data instead of using it directly here
      } else {
        Alert.alert("Error", data.error);
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
      Alert.alert("Error", "Failed to fetch orders");
    }
  };

  // Function to add an order
  const addOrder = async (order) => {
    const updatedOrders = [...orders, order];
    setOrders(updatedOrders);
    try {
      await AsyncStorage.setItem('userOrders', JSON.stringify(updatedOrders)); // Save orders
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userProfile, updateUserProfile, clearUserProfile, fetchUserOrders, orders, addOrder }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
