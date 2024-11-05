import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

const Pricing = ({ route }) => {
  const navigation = useNavigation();
  const { station, distance } = route.params;
  const [gallons, setGallons] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationErrorMsg("Permission to access location was denied");
        return;
      }

      // Get the user's current location
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Reverse geocode the location to get the address
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (address.length > 0) {
        setUserLocation(address[0]);
      } else {
        setLocationErrorMsg("Unable to fetch address");
      }
    };

    getLocation();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleConfirmOrder = () => {
    if (userLocation && gallons) {
      const pricePerGallon = station.price; // Get price from station
      const name = station.stationName;
      navigation.navigate("Payment", {
        name,
        gallons: parseFloat(gallons),
        pricePerGallon: pricePerGallon,
        distance,
      });
    } else {
      console.log("User location is not available or gallons input is empty.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#339bfd" />
        </TouchableOpacity>
        <Text style={styles.title}>Order Information</Text>
      </View>

      <View style={styles.stationInfo}>
        <Text style={styles.stationName}>{station.stationName}</Text>
        <Text style={styles.stationAddress}>{station.address}</Text>
        {distance && <Text style={styles.distance}>Distance: {distance}</Text>}
        <Text style={styles.price}>Price: ₱{station.price} per gallon</Text>
      </View>

      <Text style={styles.question}>
        How many gallons will you be ordering?
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter number of gallons"
        placeholderTextColor={"#FFF"}
        keyboardType="numeric"
        value={gallons}
        onChangeText={setGallons}
      />

      <Text style={styles.locationLabel}>Location:</Text>
      {locationErrorMsg ? (
        <Text style={styles.location}>{locationErrorMsg}</Text>
      ) : (
        <Text style={styles.location}>
          {userLocation
            ? `${userLocation.name}, ${userLocation.city}, ${userLocation.region}`
            : "Fetching location..."}
        </Text>
      )}

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmOrder}
      >
        <Text style={styles.confirmButtonText}>Confirm Order</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#162a40",
    padding: 15,
  },
  header: {
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    fontFamily: "Jakarta-Semibold",
  },
  stationInfo: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  stationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    fontFamily: "Jakarta-Semibold",
    marginBottom: 5,
  },
  stationAddress: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 10,
    fontFamily: "Jakarta-Regular",
  },
  distance: {
    fontSize: 14,
    color: "#339bfd",
    marginBottom: 10,
    fontFamily: "Jakarta-Regular",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#339bfd",
    fontFamily: "Jakarta-Semibold",
  },
  question: {
    fontSize: 16,
    color: "#FFF",
    marginTop: 20,
    marginBottom: 10,
    fontFamily: "Jakarta-Semibold",
  },
  input: {
    height: 60,
    borderColor: "#339bfd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "#FFF",
    fontSize: 15,
    marginBottom: 20,
  },
  locationLabel: {
    fontSize: 16,
    color: "#FFF",
    fontFamily: "Jakarta-Semibold",
  },
  location: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 20,
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

export default Pricing;
