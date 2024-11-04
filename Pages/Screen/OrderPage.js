import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image
} from "react-native";
import { useUser } from "../../Components/UserContext";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

export default function Order() {
  const userProfile = useUser();
  const route = useRoute();
  const email = userProfile?.userProfile?.email;
  const [orders, setOrders] = useState([]);
  const [newOrderId, setNewOrderId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://192.168.1.5:3000/api/orders?email=${email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      Alert.alert('Error', 'Failed to load orders. Please try again.');
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, [email]);

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
      if (route.params?.newOrderId) {
        setNewOrderId(route.params.newOrderId);
      }
      if (route.params?.refresh) {
        onRefresh();
      }
    }, [route.params, email])
  );

  const handleDeleteOrder = async (orderId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this order?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await fetch(`http://192.168.1.5:3000/api/orders/${orderId}`, {
                method: 'DELETE',
              });
              if (!response.ok) {
                throw new Error('Failed to delete order');
              }
              Alert.alert('Success', 'Order deleted successfully');
              fetchOrders(); // Refresh the orders list
            } catch (error) {
              console.error('Failed to delete order:', error);
              Alert.alert('Error', 'Failed to delete order. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="water" size={24} color="#4A90E2" />
        <Text style={styles.headerText}>Order Summary</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4A90E2" />
        }
      >
        {orders.length > 0 ? (
          orders.map((order) => (
            <View
              key={order._id}
              style={[
                styles.orderCard,
                order._id === newOrderId && styles.newOrderHighlight,
              ]}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderTitle}>Order {order._id}</Text>
              </View>

              <View style={styles.orderDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={18} color="#4A90E2" />
                  <Text style={styles.detailText}>{new Date(order.date).toLocaleString()}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="water-outline" size={18} color="#4A90E2" />
                  <Text style={styles.detailText}>Gallons Cost: ₱{order.gallonsCost.toFixed(2)}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="car-outline" size={18} color="#4A90E2" />
                  <Text style={styles.detailText}>Delivery Fee: ₱{order.deliveryFee.toFixed(2)}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="card-outline" size={18} color="#4A90E2" />
                  <Text style={styles.detailText}>Transaction Fee: ₱{order.transactionFee.toFixed(2)}</Text>
                </View>

                <View style={styles.totalRow}>
                  <Ionicons name="cash-outline" size={20} color="#4A90E2" />
                  <Text style={styles.totalText}>Total Cost: ₱{order.totalCost.toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.orderFooter}>
                <View style={[styles.statusBadge, { backgroundColor: order.status === 'Pending' ? '#FFA500' : '#4CAF50' }]}>
                  <Text style={styles.statusText}>{order.status || 'Pending'}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteOrder(order._id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FFF" />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Image
              source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/empty-state-XHibWTBAQDtn2402ptw1tu69fetJiX.png' }}
              style={styles.emptyStateImage}
            />
            <Text style={styles.noOrderMessage}>You have no orders yet.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#162a40',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 10,
  },
  scrollContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  newOrderHighlight: {
    borderColor: '#4A90E2',
    borderWidth: 2,
  },
  orderHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  orderDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  totalText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
    opacity: 0.7,
  },
  noOrderMessage: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});