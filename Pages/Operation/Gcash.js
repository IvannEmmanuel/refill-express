import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const Gcash = () => {
  const [mobileNumber, setMobileNumber] = useState('');
    const navigation = useNavigation();
    const route = useRoute();

    const { totalCost, gallonsCost, deliveryFee, transactionFee, name } = route.params; // Get passed data


    console.log("Station: " + name);
    console.log("Gallons Cost: ₱" + gallonsCost);
    console.log("Delivery Fee: ₱" + deliveryFee);
    console.log("Transaction Fee: ₱" + transactionFee);
    console.log("Total Cost: ₱" + totalCost);


  const handleConfirmPayment = () => {
    // Validate the mobile number format
    const isValidNumber = validateMobileNumber(mobileNumber);
    if (isValidNumber) {

      console.log(`Mobile Number: ${mobileNumber}`);
      navigation.navigate('DonePayment',{
        name,
        gallonsCost,
        deliveryFee,
        transactionFee,
        totalCost,
      })
      // Proceed with payment confirmation logic here
    } else {
      Alert.alert('Invalid Number', 'Please enter a valid Philippine mobile number starting with 09.');
    }
  };

  const validateMobileNumber = (number) => {
    // Check if the number starts with +63 or 09 and has the correct length
    const regex = /^(?:\+63|0)\d{10}$/; // Matches +63 or 0 followed by 10 digits
    return regex.test(number);
  };

  const handleMobileNumberChange = (text) => {
    // Allow only digits and limit to 11 characters
    const formattedText = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (formattedText.length <= 11) {
      setMobileNumber(formattedText);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Gcash Method</Text>
      <Image source={require('../../Images/Gcash.png')} style={styles.logo} />
      
      <TextInput
        style={styles.input}
        placeholder="Enter your mobile number"
        placeholderTextColor="#999"
        value={mobileNumber}
        onChangeText={handleMobileNumberChange}
        keyboardType="number-pad" // Changed to number-pad for better experience
        maxLength={11} // Limit to 11 characters for Philippine mobile number
      />
      
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment}>
        <Text style={styles.confirmButtonText}>Confirm Payment</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#162a40',
    padding: 15,
    alignItems: 'center',
  },
  header: {
    top: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    fontFamily: 'Jakarta-Semibold',
  },
  logo: {
    top: 20,
    width: 150, // Adjust width as needed
    height: 125,  // Adjust height as needed
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#FFF',
    marginBottom: 20,
    fontFamily: 'Jakarta-Regular',
  },
  confirmButton: {
    backgroundColor: '#339bfd',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Jakarta-Semibold',
  },
});

export default Gcash;
