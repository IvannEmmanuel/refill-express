import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TextInput, View, Button, ScrollView, ActivityIndicator, Dimensions, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import loadFonts from '../../LoadFonts/load';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const StationReg = () => {
  const [stationName, setStationName] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [region, setRegion] = useState(null);
  const mapRef = useRef(null);
  const navigation = useNavigation();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        await loadFonts();
        setFontsLoaded(true);
        await requestLocationPermission();
      } catch (error) {
        console.error("Error loading fonts or requesting location:", error);
      }
    };

    load();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLatitude(latitude);
    setLongitude(longitude);
    updateLocationInput(latitude, longitude);
  };

  const updateLocationInput = async (lat, lon) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://maps.gomaps.pro/maps/api/geocode/json?latlng=${lat},${lon}&key=AlzaSyIRdmcgCbi3PuIFh_FGH5iRo5Lf1tK_Tlb`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setLocationInput(data.results[0].formatted_address);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    const stationData = {
      stationName,
      latitude,
      longitude,
      address: locationInput,
      contactNumber,
      description,
      price: parseFloat(price),
    };

    try {
      const response = await fetch('http://192.168.1.5:3000/api/stations/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stationData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Station registered successfully:', data);
        // Reset form
        setStationName('');
        setLocationInput('');
        setContactNumber('');
        setDescription('');
        setPrice('');
        setLatitude(null);
        setLongitude(null);

        // Show Modal
        setModalMessage('Station registered successfully');
        setModalVisible(true); // Show the modal
      } else {
        const errorData = await response.json();
        console.error('Error registering station:', errorData.message);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    navigation.navigate('Dashboard', { screen: 'Home' });
  };

  if (!fontsLoaded || !region) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Water Refill Station Registration</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="business-outline" size={20} color="#333" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Station Name"
          value={stationName}
          onChangeText={setStationName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="location-outline" size={20} color="#333" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={locationInput}
          onChangeText={setLocationInput}
          editable={false}
        />
        {isLoading && <ActivityIndicator style={styles.loader} />}
      </View>

      <View style={styles.mapContainer}>
        <Text style={styles.mapInstructions}>Tap on the map to set the station location:</Text>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          onPress={handleMapPress}
        >
          {latitude && longitude && (
            <Marker
              coordinate={{ latitude, longitude }}
              draggable
              onDragEnd={(e) => handleMapPress(e)}
            />
          )}
        </MapView>
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={20} color="#333" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="pricetag-outline" size={20} color="#333" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Price per Gallon (₱)"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="information-circle-outline" size={20} color="#333" style={styles.icon} />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your station (e.g., services offered)"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      <Button 
        title="Register Station" 
        onPress={handleRegister} 
        color="#4CAF50"
        disabled={!stationName || !locationInput || !contactNumber || !price}
      />

      {/* Modal for registration success */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    padding: 30,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontFamily: "Jakarta-Semibold",
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontFamily: "Jakarta-Regular",
  },
  textArea: {
    height: 80,
  },
  mapContainer: {
    marginBottom: 15,
  },
  mapInstructions: {
    fontSize: 14,
    fontFamily: "Jakarta-Regular",
    color: '#333',
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  loader: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5, // Add shadow for Android
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default StationReg;
