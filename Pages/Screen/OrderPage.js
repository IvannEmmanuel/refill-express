import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useUser } from "../../Components/UserContext";
import { useRoute } from "@react-navigation/native";

const Order = () => {
  const userProfile = useUser();
  const route = useRoute();
  const email = userProfile?.userProfile?.email || route.params?.email;

  // Ensure orders is an array
  const orders = route.params?.orders || [];

  // Filter orders based on the user's email
  const userOrders = orders.filter(order => order.email === email);

  const [updatedOrders, setUpdatedOrders] = useState(userOrders);

  const handleDeleteOrder = (orderToDelete) => {
    setUpdatedOrders(prevOrders => 
      prevOrders.filter(order => order !== orderToDelete)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Order Summary</Text>
      <ScrollView contentContainerStyle={styles.detailsContainer}>
        {updatedOrders.length > 0 ? (
          updatedOrders.map((order, index) => (
            <View key={index} style={styles.orderContainer}>
              <Text style={styles.label}>Order {index + 1}</Text>

              <View style={styles.row}>
                <Text style={styles.label}>Email: </Text>
                <Text style={styles.value}>{email}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Gallons Cost:</Text>
                <Text style={styles.value}>₱{order.gallonsCost.toFixed(2)}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Delivery Fee:</Text>
                <Text style={styles.value}>₱{order.deliveryFee.toFixed(2)}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Transaction Fee:</Text>
                <Text style={styles.value}>₱{order.transactionFee.toFixed(2)}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Total Cost:</Text>
                <Text style={styles.totalValue}>₱{order.totalCost.toFixed(2)}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.statusValue}>{order.status || 'Pending'}</Text>
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteOrder(order)}
              >
                <Text style={styles.deleteButtonText}>Delete Order</Text>
              </TouchableOpacity>

              <View style={styles.divider} />
            </View>
          ))
        ) : (
          <Text style={styles.noOrderMessage}>You have no orders yet.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Add styles as needed
const styles = StyleSheet.create({
  value: {
    color: "#FFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#162a40", // Updated to match the Profile component background
    padding: 20,
  },
  header: {
    fontSize: 28, // Increased size to match header style in Profile
    fontWeight: "bold",
    color: "#FFF", // Updated header text color to white
    marginBottom: 20,
  },
  detailsContainer: {
    flexGrow: 1, // Ensure the container can grow if necessary
  },
  orderContainer: {
    marginBottom: 15,
    padding: 15, // Added padding for consistency with Profile
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Slightly transparent background for orders
    borderRadius: 10, // Rounded corners
  },
  label: {
    fontWeight: "bold",
    color: "#339bfd", // Use consistent label color from Profile
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5, // Added margin for spacing between rows
  },
  noOrderMessage: {
    textAlign: "center",
    fontSize: 18,
    color: "#FFF", // Updated color to white
  },
  totalValue: {
    color: "#d4b93f", // White color for total value
  },
  statusValue: {
    color: "#44c24f", // White color for status
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  deleteButton: {
    backgroundColor: "#d9534f", // Red background for delete button
    borderRadius: 5,
    padding: 4,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFF", // White text color for delete button
    fontWeight: "bold",
  },
});

export default Order;
