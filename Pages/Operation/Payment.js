import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Touchable,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RadioButton } from "react-native-paper"; // Import RadioButton here

const Payment = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { gallons, pricePerGallon, name } = route.params;
  const distance = parseFloat(route.params.distance); // Convert to a float number

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("gcash");

  console.log("Name:", name);
  console.log("Gallons:", gallons);
  console.log("Price per Gallon:", pricePerGallon);
  console.log("Distance:", distance);

  // Calculate costs
  const gallonsCost = gallons * pricePerGallon; // Cost of gallons
  const deliveryFee = !isNaN(distance) && distance ? distance * 5 : 0; // Safeguard calculation
  const transactionFee = gallonsCost * 0.02; // 0.02% transaction fee
  const totalCost = gallonsCost + deliveryFee + transactionFee; // Total cost

  const handleGcashPayment = () => {
    // Logic for confirming payment can go here
    console.log(`Payment confirmed: ${totalCost} via ${selectedPaymentMethod}`);
    navigation.navigate("Gcash", {
      name,
      totalCost,
      gallonsCost,
      deliveryFee,
      transactionFee,
    });
  };

  const handleArrivalPayment = () => {
    // Logic for confirming payment can go here
    console.log(`Payment confirmed: ${totalCost} via ${selectedPaymentMethod}`);
    navigation.navigate("DonePayment", {
      name,
      totalCost,
      gallonsCost,
      deliveryFee,
      transactionFee,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Payment Summary</Text>

      <View style={styles.fareContainer}>
        <View style={{ alignSelf: "center" }}>
          <Text style={styles.nameLabel}>{name}</Text>
        </View>
        <Text style={styles.fareLabel}>
          Gallons Cost (₱{pricePerGallon} x {gallons}):{" "}
        </Text>
        <Text style={styles.fareValue}>₱{gallonsCost.toFixed(2)}</Text>

        <Text style={styles.fareLabel}>
          Delivery Fee (₱5/km x {distance} km):{" "}
        </Text>
        <Text style={styles.fareValue}>₱{deliveryFee.toFixed(2)}</Text>

        <Text style={styles.fareLabel}>Transaction Fee (0.02%): </Text>
        <Text style={styles.fareValue}>₱{transactionFee.toFixed(2)}</Text>

        <Text style={styles.fareLabel}>Total: </Text>
        <Text style={styles.fareValue}>₱{totalCost.toFixed(2)}</Text>
      </View>

      <Text style={styles.paymentMethodLabel}>Select Payment Method:</Text>
      <View style={styles.paymentOptions}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setSelectedPaymentMethod("gcash")} // Trigger the setSelectedPaymentMethod when touched
        >
          <RadioButton
            value="gcash"
            status={selectedPaymentMethod === "gcash" ? "checked" : "unchecked"}
            // You can remove onPress from RadioButton since it's now handled by TouchableOpacity
          />
          <Text style={styles.radioButtonLabel}>GCash</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setSelectedPaymentMethod("uponArrival")} // Trigger the setSelectedPaymentMethod when touched
        >
          <RadioButton
            value="uponArrival"
            status={
              selectedPaymentMethod === "uponArrival" ? "checked" : "unchecked"
            }
            // We can remove the onPress from RadioButton since it's now handled by TouchableOpacity
          />
          <Text style={styles.radioButtonLabel}>Upon Arrival</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => {
          // Here you can call a final confirmation function if needed
          if (selectedPaymentMethod === "gcash") {
            handleGcashPayment(); // Final confirmation for GCash
          } else if (selectedPaymentMethod === "uponArrival") {
            handleArrivalPayment(); // Final confirmation for Upon Arrival
          }
        }}
      >
        <Text style={styles.confirmButtonText}>Confirm Payment</Text>
      </TouchableOpacity>

      <Text style={styles.noteText}>
        Note: By click continue, it will start delivering it to your location.
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#162a40",
    padding: 15,
  },
  noteText: {
    fontSize: 15,
    color: "#FFF",
    fontFamily: "Jakarta-Regular",
    marginVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    top: 20,
    marginBottom: 30,
    fontFamily: "Jakarta-Semibold",
  },
  fareContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  fareLabel: {
    fontSize: 16,
    color: "#FFF",
    fontFamily: "Jakarta-Regular",
  },
  nameLabel: {
    fontSize: 20,
    marginBottom: 10,
    color: "#339bfd",
    fontWeight: "bold",
    fontFamily: "Jakarta-Semibold",
  },
  fareValue: {
    fontSize: 16,
    color: "#339bfd",
    fontWeight: "bold",
    fontFamily: "Jakarta-Semibold",
  },
  paymentMethodLabel: {
    fontSize: 18,
    color: "#FFF",
    marginVertical: 20,
    fontFamily: "Jakarta-Semibold",
  },
  paymentOptions: {
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioButtonLabel: {
    fontSize: 16,
    color: "#FFF",
    fontFamily: "Jakarta-Regular",
  },
  confirmButton: {
    backgroundColor: "#339bfd",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Jakarta-Semibold",
  },
});

export default Payment;
