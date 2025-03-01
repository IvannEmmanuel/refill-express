import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import loadFonts from "../../LoadFonts/load";
import mapStyle from "../../Style/mapStyle";

export default function HomePage() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [stations, setStations] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationAddress, setLocationAddress] = useState("");
  const [selectedStation, setSelectedStation] = useState(null);
  const [showStations, setShowStations] = useState(false);
  const [polylineCoordinates, setPolylineCoordinates] = useState([]); // Initialize as an empty array
  const navigation = useNavigation();
  const mapRef = useRef(null);

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
    requestLocation();
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await fetch("http://192.168.1.5:3000/api/stations");
      const data = await response.json();

      if (location) {
        // Filter stations to only include those within 50 kilometers
        const nearbyStations = data.filter((station) => {
          const distance = calculateDistance(
            location.latitude,
            location.longitude,
            parseFloat(station.latitude),
            parseFloat(station.longitude)
          );
          return distance <= 20; // Only include stations within 20 km
        });

        setStations(nearbyStations); // Update the state with filtered stations
      } else {
        setStations(data); // If location is not available, show all stations
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      fetchAddress(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
      fetchStations();
    } else {
      console.error("Location permission not granted");
    }
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (response.length > 0) {
        const { city, region, country } = response[0];
        setLocationAddress(`${city}, ${region}, ${country}`);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance.toFixed(2);
  };

  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlat = (result >> 1) ^ -(result & 1);
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlng = (result >> 1) ^ -(result & 1);
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return points;
  };

  const fetchRouteAndDistance = async (destination) => {
    if (location) {
      const origin = `${location.latitude},${location.longitude}`;
      const dest = `${destination.latitude},${destination.longitude}`;
      const apiKey = "AlzaSyIRdmcgCbi3PuIFh_FGH5iRo5Lf1tK_Tlb"; // Replace with your actual API key

      try {
        const directionsResponse = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&key=${apiKey}`
        );
        const directionsData = await directionsResponse.json();

        if (directionsData.routes.length > 0) {
          const route = directionsData.routes[0];
          const polyline = route.overview_polyline.points;
          const points = decodePolyline(polyline); // Decode the polyline
          setPolylineCoordinates(points); // Set polyline coordinates
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    }
  };

  const handleStationSelect = async (item) => {
    if (location) {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        item.latitude,
        item.longitude
      );
      setSelectedStation({ ...item, distance: `${distance} km` });

      // Fetch and set the route
      await fetchRouteAndDistance(item);
    }
  };

  useEffect(() => {
    if (location) {
      fetchStations(); // Re-fetch stations when location is updated
    }
  }, [location]);

  if (!fontsLoaded || !location) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image source={require("../../Images/Logo.png")} style={styles.logo} />

        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          customMapStyle={mapStyle}
        >
          {location && (
            <Marker
              coordinate={location}
              title="You are here"
              description="Your current location"
            >
              <View style={styles.markerContainer}>
                <View style={styles.markerDot} />
              </View>
            </Marker>
          )}

          {polylineCoordinates.length > 0 && (
            <Polyline
              coordinates={polylineCoordinates}
              strokeColor="#339bfd"
              strokeWidth={3}
            />
          )}

          {stations.map((station) => (
            <Marker
              key={station._id}
              coordinate={{
                latitude: parseFloat(station.latitude),
                longitude: parseFloat(station.longitude),
              }}
              title={station.stationName}
              description={station.address}
            >
              <View style={styles.stationMarkerContainer}>
                <Ionicons name="water" size={24} color="#339bfd" />
              </View>
            </Marker>
          ))}
        </MapView>

        <View style={styles.waterContainer}>
          <Text style={styles.waterText}>Location</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Your current location"
              placeholderTextColor="#339bfd"
              style={styles.input}
              value={locationAddress}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.refillText}>Choose refill station</Text>
          <TouchableOpacity
            style={styles.stationToggle}
            onPress={() => setShowStations(true)}
          >
            <Ionicons name="water-outline" size={24} color="#FFF" />
            <Text style={styles.stationToggleText}>Show Refill Stations</Text>
          </TouchableOpacity>

          {selectedStation && (
            <View style={styles.selectedStation}>
              <Text style={styles.selectedTitle}>Selected Station</Text>
              <Text style={styles.selectedName}>
                {selectedStation.stationName}
              </Text>
              <Text style={styles.selectedAddress}>
                {selectedStation.address}
              </Text>
              {selectedStation.distance && (
                <Text style={styles.selectedDistance}>
                  Distance: {selectedStation.distance}
                </Text>
              )}
              <Text style={styles.selectedPrice}>
                Price: ₱{selectedStation.price}
              </Text>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={() =>
                  navigation.navigate("OrderInformation", {
                    station: selectedStation,
                    distance: selectedStation?.distance,
                  })
                }
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={showStations} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Refill Stations</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowStations(false)}
              >
                <Ionicons name="close" size={24} color="#339bfd" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={stations}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.stationItem}
                  onPress={() => {
                    handleStationSelect(item);
                    setShowStations(false);
                  }}
                >
                  <Text style={styles.stationName}>{item.stationName}</Text>
                  <Text style={styles.stationAddress}>{item.address}</Text>
                  <Text style={styles.stationPrice}>Price: ₱{item.price}</Text>
                  {location && (
                    <Text style={styles.stationDistance}>
                      Distance:{" "}
                      {calculateDistance(
                        location.latitude,
                        location.longitude,
                        parseFloat(item.latitude),
                        parseFloat(item.longitude)
                      )}{" "}
                      km
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#162a40",
    flex: 1,
  },
  stationDistance: {
    color: "#339bfd",
    fontSize: 14,
    marginTop: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  logo: {
    alignSelf: "center",
    marginVertical: 10,
  },
  map: {
    bottom: 20,
    width: "100%",
    height: 300,
  },
  markerContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(51, 155, 253, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  markerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#339bfd",
  },
  stationMarkerContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 5,
  },
  waterContainer: {
    padding: 15,
    bottom: 20,
  },
  waterText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "Jakarta-Semibold",
    marginBottom: 10,
  },
  inputContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  input: {
    color: "#FFF",
    fontSize: 16,
  },
  bottomContainer: {
    padding: 15,
    bottom: 30,
  },
  refillText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "Jakarta-Semibold",
    marginBottom: 10,
  },
  stationToggle: {
    backgroundColor: "#339bfd",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    marginBottom: 15,
  },
  stationToggleText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Jakarta-Semibold",
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#162a40",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: "Jakarta-Semibold",
  },
  closeButton: {
    padding: 5,
  },
  stationItem: {
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
  stationName: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Jakarta-Semibold",
  },
  stationAddress: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginTop: 5,
  },
  selectedStation: {
    backgroundColor: "rgba(51, 155, 253, 0.1)",
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
  },
  selectedTitle: {
    color: "#339bfd",
    fontSize: 16,
    fontFamily: "Jakarta-Semibold",
    marginBottom: 10,
  },
  selectedName: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "Jakarta-Semibold",
  },
  selectedAddress: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginTop: 5,
  },
  selectedDistance: {
    color: "#339bfd",
    fontSize: 14,
    fontFamily: "Jakarta-Semibold",
    marginTop: 10,
  },
  stationPrice: {
    color: "#FFF",
  },
  continueButton: {
    backgroundColor: "#339bfd",
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 15,
  },
  continueButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Jakarta-Semibold",
  },
  selectedPrice: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
});
