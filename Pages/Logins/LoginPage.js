import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useEffect } from "react";
import loadFonts from "../../LoadFonts/load";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../Components/UserContext"; // Adjust the path as needed

const LoginPage = () => {
  const { updateUserProfile } = useUser();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
        Alert.alert("Error", "Please enter both email and password.");
        return;
    }

    try {
        const response = await fetch('http://192.168.1.5:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (response.ok) {
            // Fetch user profile data after successful login
            const userResponse = await fetch(`http://192.168.1.5:3000/api/users/${data.userId}`);
            const userData = await userResponse.json();

            if (userResponse.ok) {
                // Here, we assume userData includes order-related fields
                await updateUserProfile(userData); // Store all user data, including order information
                Alert.alert("Success", "Login successful");

                // Pass the necessary data when navigating to the Dashboard
                navigation.navigate('Dashboard', {
                    screen: 'Home',
                    params:{
                      userId: userData._id, // Pass user ID
                      email: userData.email,
                      gallonsCost: userData.gallonsCost, // Cost of gallons ordered
                      deliveryFee: userData.deliveryFee, // Delivery fee
                      transactionFee: userData.transactionFee, // Transaction fee
                      totalCost: userData.totalCost, // Total cost of the order
                      status: userData.status, // Order status
                    }
                });
            } else {
                Alert.alert("Error", "Failed to fetch user data");
            }
        } else {
            Alert.alert("Error", data.error);
        }
    } catch (error) {
        console.error('Login error:', error);
        Alert.alert("Error", "An error occurred. Please try again.");
    }
  };


  const handleSignUp = () => {
    navigation.navigate("SignUp");
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
    return null;
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("../../Images/Logo.png")}
            style={styles.logo}
          />
          <View style={styles.formContainer}>
            <View style={styles.loginContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={"#339bfd"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={"#339bfd"}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() => console.log("Button pressed")}
            >
              <Text style={styles.forgotText}>Forgot your password?</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
                <Text style={styles.signupText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#162a40",
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logo: {
    alignSelf: "center",
    marginVertical: 50,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  signupText: {
    textAlign: "center",
    color: "#000",
    fontSize: 18,
    fontFamily: "Jakarta-Semibold",
  },
  loginText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontFamily: "Jakarta-Semibold",
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  signupButton: {
    width: "80%",
    justifyContent: "center",
    borderRadius: 20,
    height: 50,
    backgroundColor: "#FFF",
    marginTop: 15,
  },
  loginButton: {
    width: "80%",
    justifyContent: "center",
    borderRadius: 20,
    height: 50,
    backgroundColor: "#339bfd",
  },
  forgotText: {
    color: "#339bfd",
    textDecorationLine: "underline",
    fontFamily: "Jakarta-Semibold",
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 5,
    marginRight: 20,
    marginBottom: 20,
  },
  passwordContainer: {
    borderColor: "#339bfd",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    width: "100%",
    marginTop: 15,
  },
  loginContainer: {
    borderColor: "#339bfd",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
  input: {
    height: 30,
    color: "#339bfd",
    fontFamily: "Jakarta-Semibold",
    fontSize: 15,
    paddingLeft: 15,
  },
});