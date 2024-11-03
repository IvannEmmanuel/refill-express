import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import loadFonts from "../../LoadFonts/load";
import { useNavigation, CommonActions, useRoute } from "@react-navigation/native";
import { useUser } from "../../Components/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DonePayment = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const userProfile = useUser();

  const { deliveryFee, transactionFee, totalCost, gallonsCost } = route.params;
  const email = userProfile?.userProfile?.email; // Safely access the email

  const handleConfirm = async () => {
    if (!email || !deliveryFee || !transactionFee || !totalCost || !gallonsCost) {
      Alert.alert("Error", "All fields are required");
      return;
    }
  
    const newOrder = {
      email,
      deliveryFee,
      transactionFee,
      totalCost,
      gallonsCost,
      status: "Processing",
    };
  
    try {
      const response = await fetch("http://192.168.1.5:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save user data");
      }
  
      Alert.alert(
        "Confirmed",
        "Thank you for using the app, your order is being processed."
      );
  
      // Retrieve existing orders from AsyncStorage
      const existingOrders = await AsyncStorage.getItem("orderData");
      let ordersList = existingOrders ? JSON.parse(existingOrders) : [];
  
      // Ensure ordersList is an array
      if (!Array.isArray(ordersList)) {
        console.warn("Orders list is not an array, initializing to an empty array.");
        ordersList = [];
      }
  
      // Append the new order to the existing list
      ordersList.push(newOrder);
  
      // Save updated orders back to AsyncStorage
      await AsyncStorage.setItem("orderData", JSON.stringify(ordersList));
  
      // Navigate to the Dashboard and then to the Order screen
      navigation.dispatch(
        CommonActions.reset({
          index: 0, // Reset to the first index
          routes: [{ name: "Dashboard" }], // Navigate to the Dashboard
        })
      );
  
      // Navigate to the Order screen with the updated order data
      navigation.navigate("Order", { orders: ordersList });
  
    } catch (error) {
      console.error("Error during fetch:", error);
      Alert.alert("Error", error.message);
    }
  };
  
  
  

  useEffect(() => {
    const load = async () => {
      try {
        await loadFonts();
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    };

    load();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#339bfd" />; // Loading indicator
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.textTransact}>Transaction Done</Text>
      <Text style={styles.message}>
        Thank you for using the app, your order is being processed.
      </Text>
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#162a40",
    alignItems: "center",
    padding: 15,
  },
  textTransact: {
    fontSize: 25,
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Jakarta-Semibold",
    top: 30,
  },
  message: {
    fontSize: 20,
    color: "#FFF",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Jakarta-Semibold",
    marginVertical: 100,
  },
  confirmButton: {
    backgroundColor: "#339bfd",
    padding: 15,
    borderRadius: 10,
    marginVertical: 100,
    alignItems: "center",
    width: "80%",
  },
  confirmButtonText: {
    color: "#FFF",
    fontFamily: "Jakarta-Semibold",
    fontSize: 16,
  },
});

export default DonePayment;
