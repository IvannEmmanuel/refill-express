import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useUser } from "../../Components/UserContext";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, CommonActions } from "@react-navigation/native"; // Import useNavigation

export default function Component() {
  const { userProfile, loading, error } = useUser(); // Destructure logout function
  const navigation = useNavigation(); // Get the navigation object

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }; // Define format options
    const date = new Date(dateString); // Convert the timestamp to a Date object
    return date.toLocaleDateString("en-US", options); // Format the date
  };

  console.log("User Profile:", userProfile); // Log user profile data

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#339bfd" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No profile data available</Text>
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          navigation.navigate("LoginPage");
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.profilePictureContainer}>
        <Image
          source={{ uri: userProfile.profilePicture }} // Automatically use the uploaded profile picture URL
          style={styles.profilePicture}
        />
          <Text style={styles.nameText}>
            {userProfile.firstname} {userProfile.lastname}
          </Text>
        </View>
        <View style={styles.card}>
          <ProfileItem
            icon="envelope"
            label="Email"
            value={userProfile.email}
          />
          <ProfileItem
            icon="home"
            label="Address"
            value={userProfile.address}
          />
          <ProfileItem
            icon="phone"
            label="Phone"
            value={userProfile.phoneNumber || "N/A"}
          />
          <ProfileItem
            icon="calendar"
            label="Date of Birth"
            value={formatDate(userProfile.birthdate) || "N/A"}
          />

        </View>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={handleLogout}>
        <Text style={styles.editButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const ProfileItem = ({ icon, label, value }) => (
  <View style={styles.profileItem}>
    <Icon name={icon} size={24} color="#339bfd" style={styles.icon} />
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#162a40",
  },
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#339bfd",
  },
  headerText: {
    fontSize: 28,
    color: "#FFF",
    fontWeight: "bold",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
  },
  profileContainer: {
    padding: 10,
  },
  profilePictureContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#339bfd",
  },
  nameText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    marginRight: 15,
  },
  label: {
    color: "#339bfd",
    fontSize: 14,
    marginBottom: 5,
  },
  value: {
    color: "#FFF",
    fontSize: 16,
  },
  editButton: {
    backgroundColor: "#339bfd",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 30,
    bottom: 10,
  },
  editButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
