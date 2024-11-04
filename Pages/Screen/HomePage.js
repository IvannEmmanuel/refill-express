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
import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import loadFonts from "../../LoadFonts/load";
import { useNavigation } from "@react-navigation/native"
import mapStyle from '../../Style/mapStyle';
import decodePolyline from '../../Components/decodePolyline';

const HomePage = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationAddress, setLocationAddress] = useState("");
  const [selectedStation, setSelectedStation] = useState(null);
  const [showStations, setShowStations] = useState(false);
  const [distance, setDistance] = useState(null);
  const [polylineCoordinates, setPolylineCoordinates] = useState([]); // State for polyline coordinates
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
  }, []);

  const handleContinue = () => {
    // Navigate to Pricing screen and pass the selected station data
    navigation.navigate("OrderInformation", {
      station: selectedStation,
      distance: distance,
    });
  };

  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      fetchNearbyStations(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
      fetchAddress(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
    } else {
      console.error("Location permission not granted");
    }
  };

  const fetchNearbyStations = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.gomaps.pro/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=10000&keyword=water%20refill%20station&key=AlzaSy7zPvLBOOR0Y6ehGrErJFjTWFumiZlyjeR`
      );
      const data = await response.json();

      if (data.results) {
        // Add price to each station
        const stationsWithPrice = data.results.map((station) => ({
          ...station,
          price: 15, // Temporary price per gallon
        }));
        setSearchResults(stationsWithPrice);
      }
    } catch (error) {
      console.error("Error fetching nearby stations:", error);
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

  const fetchDistanceAndRoute = async (destination) => {
    if (location) {
      const origin = `${location.latitude},${location.longitude}`;
      const dest = `${destination.geometry.location.lat},${destination.geometry.location.lng}`;
      const apiKey = "AlzaSy7zPvLBOOR0Y6ehGrErJFjTWFumiZlyjeR"; // Replace with your actual API key

      try {
        // Fetching distance
        const distanceResponse = await fetch(
          `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${origin}&destinations=${dest}&key=${apiKey}`
        );
        const distanceData = await distanceResponse.json();

        if (
          distanceData.rows.length > 0 &&
          distanceData.rows[0].elements[0].status === "OK"
        ) {
          const distanceText = distanceData.rows[0].elements[0].distance.text;
          setDistance(distanceText); // Set distance text
        }

        // Fetching route for polyline
        const directionsResponse = await fetch(
          `https://maps.gomaps.pro/maps/api/directions/json?origin=${origin}&destination=${dest}&key=${apiKey}`
        );
        const directionsData = await directionsResponse.json();

        if (directionsData.routes.length > 0) {
          const polyline = directionsData.routes[0].overview_polyline.points; // Get the encoded polyline string
          const points = decodePolyline(polyline); // Decode the polyline
          setPolylineCoordinates(points); // Set polyline coordinates
        }
      } catch (error) {
        console.error("Error fetching distance or route:", error);
      }
    }
  };

  const handleStationSelect = (item) => {
    setSelectedStation(item);
    fetchDistanceAndRoute(item); // Fetch distance and route when a station is selected
  };

  if (!fontsLoaded || !location) {
    return null; // Render nothing while fonts or location are loading
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image source={require("../../Images/Logo.png")} style={styles.logo} />

        <MapView
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

          {searchResults.map((place) => (
            <Marker
              key={place.place_id}
              coordinate={{
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }}
              title={place.name}
              description={place.vicinity}
            >
              <View style={styles.stationMarkerContainer}>
                <Ionicons name="water" size={24} color="#339bfd" />
              </View>
            </Marker>
          ))}

          {polylineCoordinates.length > 0 && (
            <Polyline
              coordinates={polylineCoordinates}
              strokeColor="#339bfd"
              strokeWidth={3}
            />
          )}
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
              <Text style={styles.selectedName}>{selectedStation.name}</Text>
              <Text style={styles.selectedAddress}>
                {selectedStation.vicinity}
              </Text>
              {distance && (
                <Text style={styles.selectedDistance}>
                  Distance: {distance}
                </Text>
              )}
              <Text style={styles.selectedPrice}>
                Price: ₱{selectedStation.price} per gallon
              </Text>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
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
              data={searchResults}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.stationItem}
                  onPress={() => {
                    handleStationSelect(item);
                    setShowStations(false);
                  }}
                >
                  <Text style={styles.stationName}>{item.name}</Text>
                  <Text style={styles.stationAddress}>{item.vicinity}</Text>
                  <Text style={styles.stationPrice}>
                    Price: ₱{item.price} per gallon
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#162a40",
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  logo: {
    alignSelf: "center",
    marginVertical: 30,
  },
  map: {
    width: "100%",
    height: 300,
  },
  markerContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(51, 155, 253, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#339bfd',
  },
  stationMarkerContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 5,
  },
  waterContainer: {
    padding: 15,
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
  stationPrice: {
    color: "#FFF",
    fontSize: 14,
    marginTop: 5,
  },
  selectedPrice: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
});