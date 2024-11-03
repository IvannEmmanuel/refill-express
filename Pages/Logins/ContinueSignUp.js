import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import loadFonts from "../../LoadFonts/load";

const { width } = Dimensions.get("window");

const ContinueSignUp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { firstname, lastname, email, password, address } = route.params;

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthdate, setBirthdate] = useState(new Date());
  const [gender, setGender] = useState("Male");
  const [profilePicture, setProfilePicture] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const handleSubmit = async () => {
    const userData = {
      firstname,
      lastname,
      email,
      password,
      address,
      phoneNumber,
      birthdate: birthdate.toISOString(),
      gender,
      profilePicture,
    };

    try {
      const response = await fetch("http://192.168.1.5:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const data = await response.json();
      Alert.alert("Success", "You have successfully registered!");
      navigation.navigate("LoginPage");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "You need to grant permissions to upload an image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthdate;
    setShowDatePicker(Platform.OS === "ios");
    setBirthdate(currentDate);
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
        <Image source={require("../../Images/Logo.png")} style={styles.logo} />
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color="#339bfd" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor={"#339bfd"}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon
              name="venus-mars"
              size={20}
              color="#339bfd"
              style={styles.icon}
            />
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
          </View>
          <TouchableOpacity
            onPress={showDatepicker}
            style={[styles.inputContainer, styles.inputMargin]}
          >
            <Icon
              name="calendar"
              size={20}
              color="#339bfd"
              style={styles.icon}
            />
            <Text style={styles.input}>
              {birthdate
                ? birthdate.toLocaleDateString()
                : "Select your birthdate"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={birthdate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          <TouchableOpacity
            onPress={handleImagePicker}
            style={[styles.imagePickerButton, styles.inputMargin]}
          >
            <Icon name="camera" size={20} color="#339bfd" style={styles.icon} />
            <Text style={styles.imagePickerText}>
              {profilePicture
                ? "Change Profile Picture"
                : "Upload Profile Picture"}
            </Text>
          </TouchableOpacity>
          {profilePicture && (
            <Image
              source={{ uri: profilePicture }}
              style={styles.profilePicture}
            />
          )}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate("LoginPage")}
          >
            <Text style={styles.loginLinkText}>Already have an account?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
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
    resizeMode: "contain",
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#339bfd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    marginVertical: 15,
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
  picker: {
    flex: 1,
    height: 50,
    color: "#339bfd",
  },
  imagePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#339bfd",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  imagePickerText: {
    color: "#339bfd",
    fontFamily: "Jakarta-Semibold",
    fontSize: 16,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#339bfd",
  },
  loginLink: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  loginLinkText: {
    color: "#339bfd",
    textDecorationLine: "underline",
    fontFamily: "Jakarta-Semibold",
  },
  submitButton: {
    backgroundColor: "#FFF",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitText: {
    color: "#162a40",
    fontSize: 18,
    fontFamily: "Jakarta-Semibold",
  },
});

export default ContinueSignUp;
