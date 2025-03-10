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
  Modal, // Import Modal
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
  const [modalVisible, setModalVisible] = useState(false); // State for Modal visibility
  const [modalMessage, setModalMessage] = useState(''); // Modal message
  const [userNavigationParams, setUserNavigationParams] = useState(null); // Navigation params

  const handleLogin = async () => {
    if (!email || !password) {
      setModalMessage("Please enter both email and password.");
      setModalVisible(true);
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

      const data = await response.json();

      if (response.ok) {
        // Fetch user profile data after successful login
        const userResponse = await fetch(`http://192.168.1.5:3000/api/users/${data.userId}`);
        const userData = await userResponse.json();

        if (userResponse.ok) {
          await updateUserProfile(userData); // Store all user data
          setModalMessage("Login successful");
          setModalVisible(true);

          // Store user data for later use
          setUserNavigationParams({
            userId: userData._id,
            email: userData.email,
            gallonsCost: userData.gallonsCost,
            deliveryFee: userData.deliveryFee,
            transactionFee: userData.transactionFee,
            totalCost: userData.totalCost,
            status: userData.status,
          });
        } else {
          setModalMessage("Failed to fetch user data");
          setModalVisible(true);
        }
      } else {
        setModalMessage(data.error);
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setModalMessage("An error occurred. Please try again.");
      setModalVisible(true);
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

      {/* Modal for messages */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.okButton}
              onPress={() => {
                setModalVisible(false); // Hide the Modal
                if (userNavigationParams) {
                  // Navigate to the Dashboard if userNavigationParams is set
                  navigation.navigate('Dashboard', {
                    screen: 'Home',
                    params: userNavigationParams,
                  });
                }
              }}
            >
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    bottom: 50,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#2D436B',
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#f5f5f5'
  },
  okButton: {
    backgroundColor: '#339bfd',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  okText: {
    color: '#fff',
    fontSize: 18,
  },
});
