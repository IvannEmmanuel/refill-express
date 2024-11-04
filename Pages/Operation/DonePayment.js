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
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUser } from "../../Components/UserContext";
import { CommonActions } from "@react-navigation/native";

const DonePayment = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); // Add loading state
  const route = useRoute();
  const userProfile = useUser();

  const { deliveryFee, transactionFee, totalCost, gallonsCost } = route.params;
  const email = userProfile?.userProfile?.email;

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
      date: new Date().toISOString(),
    };
  
    setLoading(true);
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
        throw new Error(errorData.error || "Failed to save order");
      }
  
      const savedOrder = await response.json();
      Alert.alert(
        "Confirmed",
        "Thank you for using the app, your order is being processed.",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "Dashboard" }],
                })
              );
              navigation.navigate("Order", { 
                newOrderId: savedOrder._id,
                refresh: true
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error during fetch:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
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
    return <ActivityIndicator size="large" color="#339bfd" />;
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