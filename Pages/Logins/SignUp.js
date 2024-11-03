import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import loadFonts from "../../LoadFonts/load";

const { width } = Dimensions.get('window');

const SignUp = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const navigation = useNavigation();

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

  const handleContinue = () => {
    navigation.navigate("ContinueSignUp", {
      firstname,
      lastname,
      email,
      password,
      address,
    });
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("../../Images/Logo.png")}
          style={styles.logo}
        />
        <View style={styles.formContainer}>
          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Icon name="user" size={20} color="#339bfd" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="First name"
                placeholderTextColor={"#339bfd"}
                value={firstname}
                onChangeText={setFirstname}
              />
            </View>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Icon name="user" size={20} color="#339bfd" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Last name"
                placeholderTextColor={"#339bfd"}
                value={lastname}
                onChangeText={setLastname}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Icon name="envelope" size={20} color="#339bfd" style={styles.icon} />
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
          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Icon name="lock" size={20} color="#339bfd" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={"#339bfd"}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Icon name="lock" size={20} color="#339bfd" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm"
                placeholderTextColor={"#339bfd"}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Icon name="home" size={20} color="#339bfd" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Address"
              placeholderTextColor={"#339bfd"}
              value={address}
              onChangeText={setAddress}
            />
          </View>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#162a40",
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  logo: {
    alignSelf: "center",
    marginVertical: 80,
    top: 50,
    width: width * 0.7,
    height: width * 0.2,
    resizeMode: 'contain',
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: "#339bfd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    height: 50,
  },
  halfWidth: {
    width: '48%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#339bfd",
    fontFamily: "Jakarta-Semibold",
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: "#FFF",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  continueText: {
    color: "#162a40",
    fontSize: 18,
    fontFamily: "Jakarta-Semibold",
  },
});

export default SignUp;